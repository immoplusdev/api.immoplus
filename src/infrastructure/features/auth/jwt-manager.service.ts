import { Inject, Injectable } from "@nestjs/common";
import { IJwtManagerService } from "@/core/domain/auth";
import * as jwt from "jsonwebtoken";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";

@Injectable()
export class JwtManagerService implements IJwtManagerService {
  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {}

  generateAccessToken(payload: any): string {
    return jwt.sign(
      payload,
      this.configsManagerService.getEnvVariable("JWT_SECRET"),
      {
        expiresIn: this.configsManagerService.getEnvVariable("JWT_EXPIRES_IN"),
      },
    );
  }

  generateRefreshToken(payload: any): string {
    return jwt.sign(
      { id: payload.id },
      this.configsManagerService.getEnvVariable("JWT_SECRET"),
    );
  }
}
