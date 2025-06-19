import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateDemandeVisiteCommand } from "./create-demande-visite.command";
import { CreateDemandeVisiteCommandResponse } from "./create-demande-visite-command.response";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { Inject } from "@nestjs/common";
import {
  IDemandeVisiteRepository,
} from "@/core/domain/demandes-visites";
import { Deps } from "@/core/domain/common/ioc";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { IUserRepository } from "@/core/domain/users";
import {
  EstimerPrixDemandeVisiteQuery,
  GetDemandeVisiteByIdQuery,
} from "@/core/application/demandes-visites";
import { INotificationService } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";


@CommandHandler(CreateDemandeVisiteCommand)
export class CreateDemandeVisiteCommandHandler implements ICommandHandler<CreateDemandeVisiteCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.BiensImmobiliesRepository) private readonly biensImmobiliesRepository: IBienImmobilierRepository,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUserRepository,
    @Inject(Deps.NotificationService) private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService) private readonly globalizationService: IGlobalizationService,
  ) {
  }

  async execute(command: CreateDemandeVisiteCommand): Promise<CreateDemandeVisiteCommandResponse> {
    await this.verifyCanCreateDemandeVisite(command);

    const calculationResult = await this.queryBus.execute(new EstimerPrixDemandeVisiteQuery({ ...command }));

    const bienImmobilier = await this.biensImmobiliesRepository.findOne(command.bienImmobilier, { fields: ["id", "proprietaire"] });
    if (!bienImmobilier) throw new ItemNotFoundException();


    if (!command.clientPhoneNumber) {
      const client = await this.usersRepository.findOne(command.userId, {
        relations: [],
        fields: ["id", "phoneNumber"],
      });
      command.setClientPhoneNumber(client.phoneNumber);
    }

    const { id } = await this.demandeVisiteRepository.createOne({
      bienImmobilier: command.bienImmobilier,
      typeDemandeVisite: command.typeDemandeVisite,
      // datesDemandeVisite: command.datesDemandeVisite || [],
      datesDemandeVisite: [],
      notes: command.notes || null,
      montantTotalDemandeVisite: calculationResult.montantTotalDemandeVisite,
      montantDemandeVisiteSansCommission: calculationResult.montantDemandeVisiteSansCommission,
      clientPhoneNumber: command.clientPhoneNumber,
      createdBy: command.userId,
    }, false);

    return  await this.queryBus.execute(new GetDemandeVisiteByIdQuery({ id }));
  }

  private async verifyCanCreateDemandeVisite(command: CreateDemandeVisiteCommand) {
    // const occupiedDatesResponse = await this.queryBus.execute<GetBienImmobilierOccupiedDatesQuery, GetBienImmobilierOccupiedDatesQueryResponse>(
    //   new GetBienImmobilierOccupiedDatesQuery({
    //     bienImmobilierId: command.bienImmobilier,
    //   }));

    // const previousDates = this.serviceDatesToDates(occupiedDatesResponse.dates);
    // const newDates = this.serviceDatesToDates(command.datesDemandeVisite);

    // for (const date of newDates) {
    //   if (previousDates.includes(date)) {
    //     throw new DateDemandeVisiteDejaPriseException(date);
    //   }
    // }
  }

  // private serviceDatesToDates(serviceDates: ServiceDates) {
  //   return serviceDates.map(serviceDate => dateToString(serviceDate.date));
  // }
}
