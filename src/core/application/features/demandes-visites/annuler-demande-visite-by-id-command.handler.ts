import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { AnnulerDemandeVisiteByIdCommand } from "./annuler-demande-visite-by-id.command";
import { AnnulerDemandeVisiteByIdCommandResponse } from "./annuler-demande-visite-by-id-command.response";
import { UnexpectedException } from "@/core/domain/shared/exceptions";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { DemandeVisite, IDemandeVisiteRepository, StatusDemandeVisite } from "@/core/domain/demandes-visites";
import { GetDemandeVisiteByIdQuery } from "@/core/application/features/demandes-visites/get-demande-visite-by-id.query";

@CommandHandler(AnnulerDemandeVisiteByIdCommand)
export class AnnulerDemandeVisiteByIdCommandHandler implements ICommandHandler<AnnulerDemandeVisiteByIdCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
  ) {
    //
  }

  async execute(command: AnnulerDemandeVisiteByIdCommand): Promise<AnnulerDemandeVisiteByIdCommandResponse> {
    const demandeVisite = await this.demandeVisiteRepository.findOne(command.demandeVisite, { fields: ["id", "statusDemandeVisite"] });

    try {
      this.verifyCanProceed(demandeVisite.statusDemandeVisite, command.userId);
    } catch (err) {
      return await this.queryBus.execute(new GetDemandeVisiteByIdQuery({ id: command.demandeVisite }));
    }


    const payload: Partial<DemandeVisite> = {
      statusDemandeVisite: StatusDemandeVisite.Rejete,
    };

    if (command.notes) payload.notes = command.notes;

    await this.demandeVisiteRepository.updateOne(command.demandeVisite, payload);

    return await this.queryBus.execute(new GetDemandeVisiteByIdQuery({ id: command.demandeVisite }));
  }

  private verifyCanProceed(statusDemandeVisite: StatusDemandeVisite, _userId: string) {
    if (statusDemandeVisite == StatusDemandeVisite.Valide || statusDemandeVisite == StatusDemandeVisite.Rejete) throw new UnexpectedException();
  }
}
