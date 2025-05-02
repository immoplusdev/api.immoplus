import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginWithPhoneNumberOtpCommand } from "./login-with-phone-number-otp.command";
import { LoginWithPhoneNumberOtpCommandResponse } from "./login-with-phone-number-otp-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IUserRepository, User, UserNotFoundException, UserStatus } from "@/core/domain/users";
import {
  IAuthService, InvalidOtpException,
  ITfaService,
  UserCannotLoginException,
} from "@/core/domain/auth";
import { LoginCommandResponse } from "@/core/application/auth";

@CommandHandler(LoginWithPhoneNumberOtpCommand)
export class LoginWithPhoneNumberOtpCommandHandler implements ICommandHandler<LoginWithPhoneNumberOtpCommand> {
  constructor(
    @Inject(Deps.UsersRepository) private readonly userRepository: IUserRepository,
    @Inject(Deps.AuthService) private readonly authService: IAuthService,
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
  ) {
    //
  }

  async execute(command: LoginWithPhoneNumberOtpCommand): Promise<LoginWithPhoneNumberOtpCommandResponse> {
    const user = await this.userRepository.findOneByPhoneNumber(command.phoneNumber);
    if (!user) throw new UserNotFoundException();

    if (user.status != UserStatus.Active) throw new UserCannotLoginException();

    const isOtpValid = await this.tfaService.isUserSmsOtpValid(command.phoneNumber, command.otp);
    if (!isOtpValid) throw new InvalidOtpException();

    await this.createUserSession(user);

    return this.generateUserTokens(user);
  }

  private generateUserTokens(user: User): LoginCommandResponse {
    return this.authService.generateUserTokens(user);
  };

  private async createUserSession(user: User) {
    await this.authService.createUserSession(user);
  }
}
