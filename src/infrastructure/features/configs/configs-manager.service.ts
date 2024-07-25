import { Inject, Injectable } from "@nestjs/common";
import { IConfigsManagerService } from "@/core/domain/configs";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class ConfigsManagerService implements IConfigsManagerService {
  private readonly config: ConfigService;

  constructor(config: ConfigService) {
    this.config = config;
  }

  getEnvVariable<T = string>(variableName: string): T {
    return this.config.get<T>(variableName);
  }
}
