import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateDemandeVisiteCommand } from "./create-demande-visite.command";
import { CreateDemandeVisiteCommandResponse } from "./create-demande-visite-command.response";
import {
  ItemNotFoundException,
  ConflictException,
} from "@/core/domain/common/exceptions";
import { Inject } from "@nestjs/common";
import {
  IDemandeVisiteRepository,
  StatusDemandeVisite,
} from "@/core/domain/demandes-visites";
import { Deps } from "@/core/domain/common/ioc";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { IUserRepository } from "@/core/domain/users";
import {
  EstimerPrixDemandeVisiteQuery,
  EstimerPrixDemandeVisiteQueryResponse,
  GetDemandeVisiteByIdQuery,
} from "@/core/application/demandes-visites";

@CommandHandler(CreateDemandeVisiteCommand)
export class CreateDemandeVisiteCommandHandler
  implements ICommandHandler<CreateDemandeVisiteCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.BiensImmobiliesRepository)
    private readonly biensImmobiliesRepository: IBienImmobilierRepository,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
  ) {}

  async execute(
    command: CreateDemandeVisiteCommand,
  ): Promise<CreateDemandeVisiteCommandResponse> {
    const calculationResult: EstimerPrixDemandeVisiteQueryResponse =
      await this.queryBus.execute(
        new EstimerPrixDemandeVisiteQuery({ ...command }),
      );

    const bienImmobilier = await this.biensImmobiliesRepository.findOne(
      command.bienImmobilier,
      { fields: ["id", "proprietaire"] },
    );
    if (!bienImmobilier) throw new ItemNotFoundException();

    if (!command.clientPhoneNumber) {
      const client = await this.usersRepository.findOne(command.userId, {
        relations: [],
        fields: ["id", "phoneNumber"],
      });
      command.setClientPhoneNumber(client.phoneNumber);
    }

    const existingDemande = await this.demandeVisiteRepository.findOneByQuery(
      {
        _where: [
          {
            _field: "bienImmobilier",
            _op: "eq",
            _val: command.bienImmobilier,
          },
          {
            _field: "createdBy",
            _op: "eq",
            _val: command.userId,
          },
          {
            _field: "statusDemandeVisite",
            _op: "in",
            _val: [StatusDemandeVisite.Valide, StatusDemandeVisite.EnCours],
          },
        ],
      },
      { relations: [] },
    );

    if (existingDemande) {
      throw new ConflictException(
        "Vous avez déjà une demande de visite en attente sur cette résidence",
      );
    }

    const { id } = await this.demandeVisiteRepository.createOne(
      {
        bienImmobilier: command.bienImmobilier,
        typeDemandeVisite: command.typeDemandeVisite,
        datesDemandeVisite: [],
        notes: command.notes || null,
        montantTotalDemandeVisite: calculationResult.montantTotalDemandeVisite,
        montantCommission: calculationResult.montantCommission,
        clientPhoneNumber: command.clientPhoneNumber,
        createdBy: command.userId,
      },
      false,
    );

    return await this.queryBus.execute(new GetDemandeVisiteByIdQuery({ id }));
  }
}
