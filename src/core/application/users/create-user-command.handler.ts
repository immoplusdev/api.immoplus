import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create-user.command";
import { CreateUserCommandResponse } from "./create-user-command.response";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor() {
    //
  }

  async execute(
    command: CreateUserCommand,
  ): Promise<CreateUserCommandResponse> {
    return new CreateUserCommandResponse();
  }
}
