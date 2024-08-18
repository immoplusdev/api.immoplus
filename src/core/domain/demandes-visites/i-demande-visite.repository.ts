import { IBaseRepository } from '@/core/domain/shared/repositories';
import { DemandeVisite } from '@/core/domain/demandes-visites';
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/shared/models";
import { Reservation } from "@/core/domain/reservations";


export interface IDemandeVisiteRepository extends IBaseRepository<DemandeVisite, Partial<DemandeVisite>, Partial<DemandeVisite>> {
  findByBienImmobilierOwnerId(ownerId: string, query?: SearchItemsParams): Promise<WrapperResponse<DemandeVisite[]>>;
}
