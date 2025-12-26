import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginWithPhoneNumberOtpCommand } from "./login-with-phone-number-otp.command";
import { LoginWithPhoneNumberOtpCommandResponse } from "./login-with-phone-number-otp-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import {
  IUserRepository,
  User,
  UserNotFoundException,
  UserStatus,
} from "@/core/domain/users";
import {
  IAuthService,
  InvalidCredentialsException,
  InvalidOtpException,
  ITfaService,
  UserCannotLoginException,
} from "@/core/domain/auth";
import { LoginCommandResponse } from "@/core/application/auth";
import { UserApp, UserRole } from "@/core/domain/roles";
import { verifyUserType } from "../common/verify-user-type";

@CommandHandler(LoginWithPhoneNumberOtpCommand)
export class LoginWithPhoneNumberOtpCommandHandler
  implements ICommandHandler<LoginWithPhoneNumberOtpCommand>
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
    command: LoginWithPhoneNumberOtpCommand,
  ): Promise<LoginWithPhoneNumberOtpCommandResponse> {
    const user = await this.userRepository.findOneByPhoneNumber(
      command.phoneNumber,
    );
    if (!user) throw new UserNotFoundException();

    verifyUserType(user, command.source);

    if (user.status != UserStatus.Active) throw new UserCannotLoginException();

    // Verification for test phone numbers;
    const excludedPhoneNumbers = ["2250700000001", "2250700000002"];
    if (
      excludedPhoneNumbers.includes(command.phoneNumber) &&
      command.otp == "675494"
    ) {
      await this.createUserSession(user);
      return this.generateUserTokens(user);
    }

    const isOtpValid = await this.tfaService.isUserSmsOtpValid(
      command.phoneNumber,
      command.otp,
    );
    if (!isOtpValid) throw new InvalidOtpException();

    await this.createUserSession(user);

    return this.generateUserTokens(user);
  }

  private generateUserTokens(user: User): LoginCommandResponse {
    return this.authService.generateUserTokens(user);
  }

  private async createUserSession(user: User) {
    await this.authService.createUserSession(user);
  }

  private async verifyUserType(user: User, source: UserApp) {
    const allowRoles: string[] = [];
    switch (source) {
      case UserApp.AdminApp:
        allowRoles.push(UserRole.Admin);
        break;
      case UserApp.CustomerApp:
        allowRoles.push(UserRole.Customer);
        break;
      case UserApp.ProApp:
        allowRoles.push(UserRole.ProEntreprise, UserRole.ProParticulier);
        break;
    }
    const userrole = typeof user.role == "string" ? user.role : user.role.id;
    if (!allowRoles.includes(userrole))
      throw new InvalidCredentialsException({
        message: "$t:all.exception.forbidden_website",
        statusCode: 403,
        error: "Forbidden",
        code: "FORBIDDEN",
      });
  }
}
