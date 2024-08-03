import { IBaseRepository } from '@/core/domain/shared/repositories';
import { AppConfigs } from "@/core/domain/configs";


export interface IAppConfigsRepository extends IBaseRepository<AppConfigs, Partial<AppConfigs>, Partial<AppConfigs>> {}
