import { IFileUploadConfig } from "@/core/domain/files";
import { AppProfile } from "@/core/domain/shared/enums";

export interface IConfigsManagerService {
  getEnvVariable<T>(variableName: string): T;
  getFileUploadConfigs(): IFileUploadConfig;
  getAppProfile(): AppProfile;
  isAppProfileProduction(): boolean;
}
