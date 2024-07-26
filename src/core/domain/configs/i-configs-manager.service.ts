import { IFileUploadConfig } from "@/core/domain/files";

export interface IConfigsManagerService {
  getEnvVariable<T>(variableName: string): T;
  getFileUploadConfigs(): IFileUploadConfig
}
