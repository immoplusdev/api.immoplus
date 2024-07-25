export interface IConfigsManagerService {
  getEnvVariable<T>(variableName: string): T;
}
