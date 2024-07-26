import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { LoginCommandResponse } from "./login-command.response";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "@/core/domain/logging";
import { Deps } from "@/core/domain/shared/ioc";
import { InvalidCredentialsException } from "@/core/domain/shared/exceptions";
import { IUsersRepository, User } from "@/core/domain/users";
import { IConfigsManagerService } from "@/core/domain/configs";
import { IJwtManagerService, IPasswordManagerService, UserCannotLoginException } from "@/core/domain/auth";
import { UserStatus } from "@/core/domain/users";

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
    @Inject(Deps.UsersRepository) private readonly userRepository: IUsersRepository,
    @Inject(Deps.PasswordManagerService) private readonly passwordManagerService: IPasswordManagerService,
    @Inject(Deps.JwtManagerService) private readonly jwtManagerService: IJwtManagerService,
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
  ) {
    //
  }


  async execute(command: LoginCommand): Promise<LoginCommandResponse> {
    const user = await this.userRepository.findByUsername(command.username);
    if (!user) throw new InvalidCredentialsException();

    if (user.status != UserStatus.Active) throw new UserCannotLoginException();

    if (!this.passwordManagerService.passwordMatchesHash(command.password, user.password)) throw new InvalidCredentialsException();

    await this.createUserSession(user);

    return this.generateUserTokens(user);
  }

  private generateUserTokens(user: User): LoginCommandResponse {

    const payload = this.santizePayload(user);
    const accessToken = this.jwtManagerService.generateAccessToken(payload);
    const expires = this.configsManagerService.getEnvVariable<string>("JWT_REFRESH_EXPIRES_IN");
    const refreshToken = this.jwtManagerService.generateRefreshToken(payload);

    return new LoginCommandResponse({
      user,
      accessToken,
      expires,
      refreshToken,
    });
  };

  private async createUserSession(user: User) {
    // TODO: Deal with session creation
    return await new Promise((resolve, reject) => {
      resolve({});
    });
  }

  private santizePayload(payload: any) {
    return JSON.parse(JSON.stringify(payload));
  }
}
