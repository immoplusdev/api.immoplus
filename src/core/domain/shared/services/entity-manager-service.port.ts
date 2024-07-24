import { EntitiesEnum } from "../enums/app-entities.enum";
import { AppServiceOptions } from "../models/app-service-options.model";
import { AppServices } from "../models/app-services.model";
import { ItemsServicePort } from "./items-service.port";

export interface EntityManagerServicePort {
  getItemsServiceInstance<T>(
    entity: EntitiesEnum,
    serviceOptions: AppServiceOptions
  ): ItemsServicePort<T>;
  getAppServices(): AppServices;
}
