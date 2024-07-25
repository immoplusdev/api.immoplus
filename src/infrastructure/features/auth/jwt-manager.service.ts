import { Inject, Injectable } from "@nestjs/common";
import { IJwtManagerService, JwtSignOptions } from "@/core/domain/auth";
import { JwtService } from "@nestjs/jwt";
import * as jwt from "jsonwebtoken";
import { Deps } from "@/core/domain/shared/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";

@Injectable()
export class JwtManagerService implements IJwtManagerService {
  private jwtService: JwtService;

  constructor(
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
  ) {
    this.jwtService = new JwtService();
  }

  generateAccessToken(payload: any): string {
    return jwt.sign(payload,
      this.configsManagerService.getEnvVariable("JWT_SECRET"),
      {
        expiresIn: this.configsManagerService.getEnvVariable("JWT_EXPIRES_IN"),
      });
  }

  generateRefresh(payload: any): string {
    return jwt.sign({ id: payload.id },
      this.configsManagerService.getEnvVariable("JWT_SECRET"));
  }
}
