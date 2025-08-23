import { IBaseRepository } from "@/core/domain/common/repositories";
import { Reservation } from "@/core/domain/reservations";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/common/models";

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
}
