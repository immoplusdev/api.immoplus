import { IBaseRepository } from '@/core/domain/shared/repositories';
import { DemandeVisite } from '@/core/domain/demandes-visites';


export interface IDemandeVisiteRepository extends IBaseRepository<DemandeVisite, Partial<DemandeVisite>, Partial<DemandeVisite>> {}
