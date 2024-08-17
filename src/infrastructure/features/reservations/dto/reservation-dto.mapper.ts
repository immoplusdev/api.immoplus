import { Reservation } from "@/core/domain/reservations";
import { ReservationDto } from "./reservation.dto";


export class ReservationDtoMapper {
  mapFrom(object: Reservation): ReservationDto {
    return new ReservationDto(object);
  }

  mapTo(object: ReservationDto): Reservation {
    return new Reservation(object);
  }
}
