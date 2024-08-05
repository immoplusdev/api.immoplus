import { OmitMethods } from "@/lib/ts-utilities";
import { Reservation } from "@/core/domain/reservations";

export class AnnulerReservationByIdCommandResponse extends Reservation {
  id: string;

  constructor(data?: OmitMethods<AnnulerReservationByIdCommandResponse>) {
    if (data) super(data);
  }
}
