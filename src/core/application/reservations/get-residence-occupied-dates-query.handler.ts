import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetResidenceOccupiedDatesQueryResponse } from "./get-residence-occupied-dates-query.response";
import { GetResidenceOccupiedDatesQuery } from "./get-residence-occupied-dates.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IReservationRepository } from "@/core/domain/reservations";
import { IResidenceRepository } from "@/core/domain/residences";
import { StatusFacture } from "@/core/domain/payments";

@QueryHandler(GetResidenceOccupiedDatesQuery)
export class GetResidenceOccupiedDateQueryHandler implements IQueryHandler<
  GetResidenceOccupiedDatesQuery,
  GetResidenceOccupiedDatesQueryResponse
> {
  constructor(
    @Inject(Deps.ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
  ) {
    //
  }

  async execute(
    query: GetResidenceOccupiedDatesQuery,
  ): Promise<GetResidenceOccupiedDatesQueryResponse> {
    console.log(
      "Executing GetResidenceOccupiedDatesQueryHandler with query:",
      query,
    );
    const reservations = await this.reservationRepository.findByQuery(
      {
        _where: [
          {
            _field: "residence.id",
            _op: "eq",
            _val: query.residenceId,
          },
          {
            _field: "statusFacture",
            _op: "eq",
            _val: StatusFacture.Paye,
          },
        ],
      },
      { relations: [], fields: ["id", "datesReservation"] },
    );

    console.log(
      `Found ${reservations.data.length} reservations for residence ID ${query.residenceId}`,
    );
    const residence = await this.residenceRepository.findOne(
      query.residenceId,
      {
        relations: [],
      },
    );

    const reservationDates = reservations.data
      .map((reservation) => reservation.datesReservation)
      .flat();

    const residenceDates = residence?.datesReservation ?? [];

    const dates = [...reservationDates, ...residenceDates];

    return new GetResidenceOccupiedDatesQueryResponse({ dates });
  }
}
