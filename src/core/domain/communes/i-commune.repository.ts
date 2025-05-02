import { IBaseRepository } from '@/core/domain/common/repositories';
import { Commune } from '@/core/domain/communes';


export interface ICommuneRepository extends IBaseRepository<Commune, Partial<Commune>, Partial<Commune>> {}
