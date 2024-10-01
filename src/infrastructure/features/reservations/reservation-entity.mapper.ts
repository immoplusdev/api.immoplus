import { IMapper } from "@/lib/ts-utilities";
import { ReservationEntity } from "./reservation.entity";
import { Reservation } from "@/core/domain/reservations";

export class ReservationEntityMapper implements IMapper<ReservationEntity, Reservation> {
  mapFrom(param: ReservationEntity): Reservation {
    return new Reservation(param);
  }

  mapTo(param: Reservation): ReservationEntity {
    return new ReservationEntity(param);
  }
}