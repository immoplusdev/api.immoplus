import { Inject, Injectable } from "@nestjs/common";
import { IConfigsManagerService } from "@/core/domain/configs";
import { ConfigService } from "@nestjs/config";
import { fileUploadConfig } from "@/infrastructure/configs";
import { IFileUploadConfig } from "@/core/domain/files";


@Injectable()
export class ConfigsManagerService implements IConfigsManagerService {
  private readonly config: ConfigService;

  constructor(config: ConfigService) {
    this.config = config;
  }

  getEnvVariable<T = string>(variableName: string): T {
    return this.config.get<T>(variableName);
  }

  getFileUploadConfigs(): IFileUploadConfig{
    return fileUploadConfig;
  }
}
