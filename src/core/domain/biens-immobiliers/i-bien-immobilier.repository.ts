import { IBaseRepository } from "@/core/domain/common/repositories";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { SearchBienImmobiliereGeoItemsParams } from "../http/search-items-params";
import { WrapperResponse } from "../common/models";

export interface IBienImmobilierRepository
  extends IBaseRepository<
    BienImmobilier,
    Partial<BienImmobilier>,
    Partial<BienImmobilier>
  > {
  findByGeolocation(
    query: SearchBienImmobiliereGeoItemsParams,
  ): Promise<WrapperResponse<BienImmobilier[]>>;
  findByGeolocationFilter(
    query: SearchBienImmobiliereGeoItemsParams,
  ): Promise<WrapperResponse<BienImmobilier[]>>;
  updateAllCordonates(): Promise<WrapperResponse<BienImmobilier[]>>;
}
