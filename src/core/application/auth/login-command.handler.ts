import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { LoginCommandResponse } from "./login-command.response";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "@/core/domain/logging";
import { Deps } from "@/core/domain/common/ioc";
import { IUserRepository, User } from "@/core/domain/users";
import {
  IAuthService,
  InvalidCredentialsException,
  IPasswordManagerService,
  UserCannotLoginException,
} from "@/core/domain/auth";
import { UserStatus } from "@/core/domain/users";
import { verifyUserType } from "../common/verify-user-type";

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
    @Inject(Deps.UsersRepository)
    private readonly userRepository: IUserRepository,
    @Inject(Deps.AuthService) private readonly authService: IAuthService,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
  ) {
    //
  }

  async execute(command: LoginCommand): Promise<LoginCommandResponse> {
    const user = await this.userRepository.findOneByUsername(command.username);

    this.verifyUserCanLogin(user);

    verifyUserType(user, command.source);

    this.verifyPassword(command.password, user.password);

    await this.createUserSession(user);

    return this.generateUserTokens(user);
  }

  private verifyUserCanLogin(user: User) {
    if (!user)
      throw new InvalidCredentialsException({
        message: "$t:all.exception.invalid_credentials",
        statusCode: 401,
        error: "Unauthorized",
        code: "UNAUTHORIZED",
      });

    if (user.status != UserStatus.Active) throw new UserCannotLoginException();
    // if((user.role as Role).id == UserRole.Admin) throw new UserCannotLoginException();
  }

  private generateUserTokens(user: User): LoginCommandResponse {
    return this.authService.generateUserTokens(user);
  }

  private async createUserSession(user: User) {
    await this.authService.createUserSession(user);
  }

  private verifyPassword(password: string, hash: string) {
    if (!this.passwordManagerService.passwordMatchesHash(password, hash))
      throw new InvalidCredentialsException({
        message: "$t:all.exception.invalid_credentials",
        statusCode: 401,
        error: "Unauthorized",
        code: "UNAUTHORIZED",
      });
  }
}
