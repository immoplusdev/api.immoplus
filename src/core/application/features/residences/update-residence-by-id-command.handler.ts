import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateResidenceByIdCommand } from "./update-residence-by-id.command";
import { UpdateResidenceByIdCommandResponse } from "./update-residence-by-id-command.response";
import { IResidenceRepository, Residence } from "@/core/domain/residences";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { omitObjectProperties } from "@/lib/ts-utilities";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";
import { AccessForbiddenException } from "@/core/domain/auth";

@CommandHandler(UpdateResidenceByIdCommand)
export class UpdateResidenceByIdCommandHandler implements ICommandHandler<UpdateResidenceByIdCommand> {
  constructor(
    @Inject(Deps.ResidenceRepository) private readonly repository: IResidenceRepository,
  ) {
    //
  }

  async execute(command: UpdateResidenceByIdCommand): Promise<UpdateResidenceByIdCommandResponse> {

    const residence = await this.repository.findOne(command.residenceId);
    this.verifyCanProceed(command, residence);

    const residenceData = this.sanitizePayload(command);

    await this.repository.updateOne(command.residenceId, residenceData);

    return await this.repository.findOne(command.residenceId);
  }

  private verifyCanProceed(command: UpdateResidenceByIdCommand, residence: Residence): void {
    if (!residence) throw new ItemNotFoundException();
    if (!command.isAdmin && residence.proprietaire != command.userId) throw new AccessForbiddenException();
  }

  private sanitizePayload(payload: UpdateResidenceByIdCommand): Partial<Residence> {
    const residenceData: Partial<Residence> = omitObjectProperties(payload, ["isAdmin", "residenceId", "userId"]);
    if (!payload.isAdmin) {
      // if (this.isUpdatingOneField(residenceData) && residenceData.residenceDisponible != undefined) return;
      residenceData.statusValidation = StatusValidationBienImmobilier.EnAttenteValidation;
    }
    return residenceData;
  }

  private isUpdatingOneField(residendeData: Partial<Residence>): boolean {
    return Object.keys(residendeData).length === 1;
  }
}
