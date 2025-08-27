import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshTokenCommand } from "./refresh-token.command";
import { RefreshTokenCommandResponse } from "./refresh-token-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IUserRepository, User } from "@/core/domain/users";
import {
  IAuthService,
  IJwtManagerService,
  InvalidRefreshTokenException,
  UserCannotLoginException,
} from "@/core/domain/auth";
import { UserStatus } from "@/core/domain/users";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly userRepository: IUserRepository,
    @Inject(Deps.AuthService)
    private readonly authService: IAuthService,
    @Inject(Deps.JwtManagerService)
    private readonly jwtManagerService: IJwtManagerService,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenCommandResponse> {
    const payload = this.verifyRefreshToken(command.refreshToken);

    const user = await this.getUserFromPayload(payload);

    this.verifyUserCanLogin(user);

    await this.createUserSession(user);

    return this.generateUserTokens(user);
  }

  private verifyRefreshToken(refreshToken: string): any {
    try {
      return this.jwtManagerService.verifyToken(refreshToken);
    } catch (error) {
      throw new InvalidRefreshTokenException();
    }
  }

  private async getUserFromPayload(payload: any): Promise<User> {
    if (!payload.sub) {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.userRepository.findOne(payload.sub);
    if (!user) {
      throw new InvalidRefreshTokenException();
    }

    return user;
  }

  private verifyUserCanLogin(user: User) {
    if (user.status !== UserStatus.Active) {
      throw new UserCannotLoginException();
    }
  }

  private async createUserSession(user: User) {
    await this.authService.createUserSession(user);
  }

  private generateUserTokens(user: User): RefreshTokenCommandResponse {
    const tokens = this.authService.generateUserTokens(user);
    return new RefreshTokenCommandResponse(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expires,
    );
  }
}
