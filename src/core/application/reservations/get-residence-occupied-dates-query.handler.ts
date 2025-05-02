import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetResidenceOccupiedDatesQueryResponse } from "./get-residence-occupied-dates-query.response";
import { GetResidenceOccupiedDatesQuery } from "./get-residence-occupied-dates.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IReservationRepository } from "@/core/domain/reservations";

@QueryHandler(GetResidenceOccupiedDatesQuery)
export class GetResidenceOccupiedDateQueryHandler
  implements IQueryHandler<GetResidenceOccupiedDatesQuery, GetResidenceOccupiedDatesQueryResponse> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
  ) {
    //
  }

  async execute(query: GetResidenceOccupiedDatesQuery): Promise<GetResidenceOccupiedDatesQueryResponse> {
    const reservations = await this.reservationRepository.findByQuery({
      _where: [
        {
          _field: "residence",
          _val: query.residenceId,
        },
      ],
    }, { relations: [], fields: ["datesReservation"] });
    const dates = reservations.data.map((reservation) => reservation.datesReservation).flat();
    return new GetResidenceOccupiedDatesQueryResponse({ dates });
  }
}
