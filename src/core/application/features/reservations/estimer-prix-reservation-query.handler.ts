import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { EstimerPrixReservationQueryResponse } from "./estimer-prix-reservation-query.response";
import { EstimerPrixReservationQuery } from "./estimer-prix-reservation.query";

@QueryHandler(EstimerPrixReservationQuery)
export class EstimerPrixReservationQueryHandler
  implements IQueryHandler<EstimerPrixReservationQuery, EstimerPrixReservationQueryResponse>
{
  constructor() {
    //
  }
  async execute(query: EstimerPrixReservationQuery): Promise<EstimerPrixReservationQueryResponse> {
    return new EstimerPrixReservationQueryResponse();
  }
}