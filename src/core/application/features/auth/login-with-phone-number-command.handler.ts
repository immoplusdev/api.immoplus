import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginWithPhoneNumberCommand } from "./login-with-phone-number.command";
import { LoginWithPhoneNumberCommandResponse } from "./login-with-phone-number-command.response";

@CommandHandler(LoginWithPhoneNumberCommand)
export class LoginWithPhoneNumberCommandHandler implements ICommandHandler<LoginWithPhoneNumberCommand> {
  constructor() {
    //
  }

  async execute(command: LoginWithPhoneNumberCommand): Promise<LoginWithPhoneNumberCommandResponse> {
    return new LoginWithPhoneNumberCommandResponse();
  }
}
