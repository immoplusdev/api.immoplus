import { IMapper } from "@/lib/ts-utilities";
import { ReservationEntity } from "./reservation.entity";
import { Reservation } from "@/core/domain/reservations";

export class ReservationEntityMapper implements IMapper<ReservationEntity, Reservation> {
  mapFrom(param: ReservationEntity): Reservation {
    const object = new Reservation({ ...param, residenceId: null });
    if (typeof param.residence === "object") object.residenceId = param.residence.id;
    return object;
  }

  mapTo(param: Reservation): ReservationEntity {
    return new ReservationEntity(param);
  }
}