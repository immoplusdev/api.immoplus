import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UpdateResidenceByIdCommand } from "./update-residence-by-id.command";
import { UpdateResidenceByIdCommandResponse } from "./update-residence-by-id-command.response";
import { IResidenceRepository, Residence } from "@/core/domain/residences";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { omitObjectProperties } from "@/lib/ts-utilities";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { ResidenceStatusValidationUpdatedEvent } from "@/core/application/residences/residence-status-validation-updated.event";

@CommandHandler(UpdateResidenceByIdCommand)
export class UpdateResidenceByIdCommandHandler implements ICommandHandler<UpdateResidenceByIdCommand> {
  constructor(
    @Inject(Deps.ResidenceRepository)
    private readonly repository: IResidenceRepository,
    private readonly eventBus: EventBus,
  ) {
    //
  }

  async execute(
    command: UpdateResidenceByIdCommand,
  ): Promise<UpdateResidenceByIdCommandResponse> {
    const residence = await this.repository.findOne(command.residenceId);
    this.verifyCanProceed(command, residence);

    const residenceData = this.sanitizePayload(command);

    if (residenceData.statusValidation)
      this.eventBus.publish(
        new ResidenceStatusValidationUpdatedEvent({
          id: command.residenceId,
          status: residenceData.statusValidation,
        }),
      );

    await this.repository.updateOne(command.residenceId, residenceData);

    return await this.repository.findOne(command.residenceId);
  }

  private verifyCanProceed(
    command: UpdateResidenceByIdCommand,
    residence: Residence,
  ): void {
    if (!residence) throw new ItemNotFoundException();
    // if (!command.isAdmin || (residence?.proprietaire && residence?.proprietaire != command.userId)) throw new AccessForbiddenException();
  }

  private sanitizePayload(
    payload: UpdateResidenceByIdCommand,
  ): Partial<Residence> {
    const residenceData: Partial<Residence> = omitObjectProperties(payload, [
      "isAdmin",
      "residenceId",
      "userId",
    ]);
    if (!payload.isAdmin) {
      // if (this.isUpdatingOneField(residenceData) && residenceData.residenceDisponible != undefined) return;
      residenceData.statusValidation =
        StatusValidationBienImmobilier.EnAttenteValidation;
    }
    return residenceData;
  }
}
