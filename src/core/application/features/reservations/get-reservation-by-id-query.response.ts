import { Reservation } from "@/core/domain/reservations";
import { Residence } from "@/core/domain/residences";
import { PublicUserInfo } from "@/core/domain/users";
import { OmitMethods } from "@/lib/ts-utilities";

export class GetReservationByIdQueryResponse extends Reservation {
  residence: Residence;
  client: PublicUserInfo;
  proprietaire: PublicUserInfo;

  constructor(data?: OmitMethods<GetReservationByIdQueryResponse>) {
    if (data) super(data);
  }
}
