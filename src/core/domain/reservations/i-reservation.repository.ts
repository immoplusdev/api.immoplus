import { IBaseRepository } from "@/core/domain/common/repositories";
import { Reservation } from "@/core/domain/reservations";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/common/models";
import { EstimateReservationCostDto } from "@/core/application/reservations/estimate-reservation-cost.dto";

export interface IReservationRepository
  extends IBaseRepository<
    Reservation,
    Partial<Reservation>,
    Partial<Reservation>
  > {
  findByResidenceOwnerId(
    ownerId: string,
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<Reservation[]>>;

  estimateReservationCost(payload: EstimateReservationCostDto): Promise<any>;
}
