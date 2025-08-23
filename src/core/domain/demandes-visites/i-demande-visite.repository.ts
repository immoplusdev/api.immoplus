import { IBaseRepository } from "@/core/domain/common/repositories";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/common/models";

export interface IDemandeVisiteRepository
  extends IBaseRepository<
    DemandeVisite,
    Partial<DemandeVisite>,
    Partial<DemandeVisite>
  > {
  findByBienImmobilierOwnerId(
    ownerId: string,
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<DemandeVisite[]>>;
}
