import { Inject, Injectable } from "@nestjs/common";
import { AppConfigs, IAppConfigsRepository, IConfigsManagerService, PublicConfigs } from "@/core/domain/configs";
import { ConfigService } from "@nestjs/config";
import { fileUploadConfig } from "@/infrastructure/configs";
import { IFileUploadConfig } from "@/core/domain/files";
import { AppProfile } from "@/core/domain/shared/enums";
import { Deps } from "@/core/domain/shared/ioc";


@Injectable()
export class ConfigsManagerService implements IConfigsManagerService {
  private readonly config: ConfigService;

  constructor(
    config: ConfigService,
    @Inject(Deps.AppConfigsRepository) private readonly appConfigsRepository: IAppConfigsRepository) {
    this.config = config;
  }

  getEnvVariable<T = string>(variableName: string): T {
    return this.config.get<T>(variableName);
  }

  getFileUploadConfigs(): IFileUploadConfig {
    return fileUploadConfig;
  }

  getAppProfile(): AppProfile {
    return this.getEnvVariable<AppProfile>("NEST_APP_PROFILE");
  }

  isAppProfileProduction(): boolean {
    return this.getAppProfile() === AppProfile.Prod;
  }

  async getAppConfigs(): Promise<AppConfigs> {
    const items = await this.appConfigsRepository.findByQuery();
    return items.at(0);
  }

  async updateAppConfigs(payload: Partial<AppConfigs>): Promise<string> {
    const id = await this.getAppConfigsId();
    await this.appConfigsRepository.updateOne(id, payload);
    return id;
  }

  async getAppConfigsId(): Promise<string> {
    const [{ id }] = await this.appConfigsRepository.findByQuery({ _select: ["id"] });
    return id;
  }

  async getPublicConfigs(): Promise<PublicConfigs> {
    const appConfigs = await this.getAppConfigs();


    return new PublicConfigs({
      ...appConfigs,
      categories: [],
      categoryPaymentTypes: [],
      defaultStatus: [],
      galleryGroups: [],
      languages: [],
      orderPaymentTypes: [],
      paymentStatus: [],
      productTypes: [],
      servicePaymentTypes: [],
      serviceStatus: [],
      shippingStatus: [],
      shippingTypes: [],
      visitPaymentTypes: [],
    });
  }
}
