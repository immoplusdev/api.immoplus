import { IBaseRepository } from '@/core/domain/shared/repositories';
import { BienImmobilier } from '@/core/domain/biens-immobiliers';


export interface IBienImmobilierRepository extends IBaseRepository<BienImmobilier, Partial<BienImmobilier>, Partial<BienImmobilier>> {}
