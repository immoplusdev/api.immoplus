import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginWithEmailOtpCommand } from "./login-with-email-otp.command";
import { LoginWithEmailOtpCommandResponse } from "./login-with-email-otp-command.response";
import {
  IUserRepository,
  User,
  UserNotFoundException,
  UserStatus,
} from "@/core/domain/users";
import { LoginCommandResponse } from "@/core/application/auth";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import {
  IAuthService,
  ITfaService,
  UserCannotLoginException,
} from "@/core/domain/auth";

@CommandHandler(LoginWithEmailOtpCommand)
export class LoginWithEmailOtpCommandHandler
  implements ICommandHandler<LoginWithEmailOtpCommand>
{
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly userRepository: IUserRepository,
    @Inject(Deps.AuthService) private readonly authService: IAuthService,
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
  ) {
    //
  }

  async execute(
    command: LoginWithEmailOtpCommand,
  ): Promise<LoginWithEmailOtpCommandResponse> {
    const user = await this.userRepository.findOneByEmail(command.email);
    if (!user) throw new UserNotFoundException();

    if (user.status != UserStatus.Active) throw new UserCannotLoginException();

    await this.tfaService.verifyUserEmailOtp(command.email, command.otp, {
      throwException: true,
      resetIfValid: true,
    });

    await this.createUserSession(user);

    return this.generateUserTokens(user);
  }

  private generateUserTokens(user: User): LoginCommandResponse {
    return this.authService.generateUserTokens(user);
  }

  private async createUserSession(user: User) {
    await this.authService.createUserSession(user);
  }
}
