import { IBaseRepository } from '@/core/domain/common/repositories';
import { AppConfigs } from "@/core/domain/configs";


export interface IAppConfigsRepository extends IBaseRepository<AppConfigs, Partial<AppConfigs>, Partial<AppConfigs>> {}
