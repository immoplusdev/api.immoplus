import { IFileUploadConfig } from "@/core/domain/files";
import { AppProfile } from "@/core/domain/shared/enums";
import { AppConfigs } from "@/core/domain/configs/app-configs.model";
import { PublicConfigs } from "@/core/domain/configs/public-configs.model";

export interface IConfigsManagerService {
  getEnvVariable<T>(variableName: string): T;
  getFileUploadConfigs(): IFileUploadConfig;
  getAppProfile(): AppProfile;
  isAppProfileProduction(): boolean;
  getAppConfigs(): Promise<AppConfigs>;
  getPublicConfigs(): Promise<PublicConfigs>;
  getAppConfigsId(): Promise<string>;
  updateAppConfigs(payload: Partial<AppConfigs>): Promise<string>;
}
