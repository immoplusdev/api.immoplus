import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetReservationByIdQueryResponse } from "./get-reservation-by-id-query.response";
import { GetReservationByIdQuery } from "./get-reservation-by-id.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IReservationRepository } from "@/core/domain/reservations";
import { IUserRepository } from "@/core/domain/users";
import { IResidenceRepository } from "@/core/domain/residences";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";

@QueryHandler(GetReservationByIdQuery)
export class GetReservationByIdQueryHandler
  implements IQueryHandler<GetReservationByIdQuery, GetReservationByIdQueryResponse> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUserRepository,
    @Inject(Deps.ResidenceRepository) private readonly residenceRepository: IResidenceRepository,
  ) {
    //
  }

  async execute(query: GetReservationByIdQuery): Promise<GetReservationByIdQueryResponse> {
    const reservation = await this.reservationRepository.findOne(query.id);
    if (!reservation) throw new ItemNotFoundException();

    const residence = await this.residenceRepository.findOne(reservation.residenceId);
    if (!residence) throw new ItemNotFoundException();

    const client = await this.usersRepository.findPublicUserInfoByUserId(reservation.createdBy);
    const proprietaire = await this.usersRepository.findPublicUserInfoByUserId(residence.proprietaire);

    return {
      ...reservation,
      residence,
      client,
      proprietaire,
    };
  }
}