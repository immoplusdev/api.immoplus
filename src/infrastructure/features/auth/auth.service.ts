import { Inject, Injectable } from "@nestjs/common";
import { IAuthService, IJwtManagerService, LoginResponse } from "@/core/domain/auth";
import { User } from "@/core/domain/users";
import { Deps } from "@/core/domain/shared/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Deps.JwtManagerService) private readonly jwtManagerService: IJwtManagerService,
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
  ) {
    //
  }

  generateUserTokens(user: User): LoginResponse {
    const payload = this.santizePayload(user);
    const accessToken = this.jwtManagerService.generateAccessToken(payload);
    const expires = this.configsManagerService.getEnvVariable<string>("JWT_REFRESH_EXPIRES_IN");
    const refreshToken = this.jwtManagerService.generateRefreshToken(payload);

    return new LoginResponse({
      user: new User(user).clearPassword(),
      accessToken,
      expires,
      refreshToken,
    });
  }

  async createUserSession(user: User): Promise<void> {
    // TODO: Deal with session creation
    return await new Promise((resolve, reject) => {
      resolve({} as never,
      );
    });
  }

  private santizePayload(payload: any) {
    return JSON.parse(JSON.stringify(payload));
  }
}
