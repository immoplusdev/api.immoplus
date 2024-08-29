import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { ProgrammerDemandeVisiteCommand } from "./programmer-demande-visite.command";
import { ProgrammerDemandeVisiteCommandResponse } from "./programmer-demande-visite-command.response";
import { GetDemandeVisiteByIdQuery } from "@/core/application/features/demandes-visites/get-demande-visite-by-id.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";

@CommandHandler(ProgrammerDemandeVisiteCommand)
export class ProgrammerDemandeVisiteCommandHandler implements ICommandHandler<ProgrammerDemandeVisiteCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
  ) {
    //
  }

  async execute(command: ProgrammerDemandeVisiteCommand): Promise<ProgrammerDemandeVisiteCommandResponse> {
    await this.demandeVisiteRepository.updateOne(command.id, {
      datesDemandeVisite: command.datesDemandeVisite,
    });

    return await this.queryBus.execute(new GetDemandeVisiteByIdQuery({ id: command.id }));
  }
}
