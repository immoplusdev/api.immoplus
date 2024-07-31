import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { LoginCommandResponse } from "./login-command.response";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "@/core/domain/logging";
import { Deps } from "@/core/domain/shared/ioc";
import { InvalidCredentialsException } from "@/core/domain/shared/exceptions";
import { IUsersRepository, User } from "@/core/domain/users";
import {
  IAuthService,
  IPasswordManagerService,
  UserCannotLoginException,
} from "@/core/domain/auth";
import { UserStatus } from "@/core/domain/users";

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
    @Inject(Deps.UsersRepository) private readonly userRepository: IUsersRepository,
    @Inject(Deps.AuthService) private readonly authService: IAuthService,
    @Inject(Deps.PasswordManagerService) private readonly passwordManagerService: IPasswordManagerService,
  ) {
    //
  }


  async execute(command: LoginCommand): Promise<LoginCommandResponse> {
    const user = await this.userRepository.findByUsername(command.username);
    if (!user) throw new InvalidCredentialsException();

    if (user.status != UserStatus.Active) throw new UserCannotLoginException();

    this.verifyPassword(command.password, user.password);

    await this.createUserSession(user);

    return this.generateUserTokens(user);
  }

  private generateUserTokens(user: User): LoginCommandResponse {
    return this.authService.generateUserTokens(user);
  };

  private async createUserSession(user: User) {
    await this.authService.createUserSession(user);
  }

  private verifyPassword(password: string, hash: string) {
    if (!this.passwordManagerService.passwordMatchesHash(password, hash)) throw new InvalidCredentialsException();
  }
}
