import { IBaseRepository } from "@/core/domain/common/repositories";
import { Residence } from "@/core/domain/residences";
import { SearchItemsParams } from "../http/search-items-params";
import { WrapperResponse } from "../common/models/wrapper-response.model";

export interface IResidenceRepository extends IBaseRepository<Residence, Partial<Residence>, Partial<Residence>> {
    findAvailableResidencesForToday(query?: SearchItemsParams): Promise<WrapperResponse<Residence[]>>
}
