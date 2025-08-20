import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "./update-user.command";
import { UpdateUserCommandResponse } from "./update-user-command.response";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor() {
    //
  }

  async execute(
    command: UpdateUserCommand,
  ): Promise<UpdateUserCommandResponse> {
    return new UpdateUserCommandResponse();
  }
}
