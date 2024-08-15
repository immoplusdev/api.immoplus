import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDemandeVisiteCommand } from "./create-demande-visite.command";
import { CreateDemandeVisiteCommandResponse } from "./create-demande-visite-command.response";

@CommandHandler(CreateDemandeVisiteCommand)
export class CreateDemandeVisiteCommandHandler implements ICommandHandler<CreateDemandeVisiteCommand> {
  constructor() {
    //
  }

  async execute(command: CreateDemandeVisiteCommand): Promise<CreateDemandeVisiteCommandResponse> {
    return new CreateDemandeVisiteCommandResponse();
  }
}
