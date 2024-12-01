import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@/core/domain/payments";

export class CreateDemandeRetraitReservationCommand {
  @ApiProperty({ format: "uuid" })
  reservationId: string;
  @ApiProperty({ enum: PaymentMethod, enumName: "PaymentMethod" })
  paymentMethod: PaymentMethod;
  @ApiProperty()
  paymentAddress: string;
  userId: string;

  constructor(data?: OmitMethods<CreateDemandeRetraitReservationCommand>) {
    if (data) Object.assign(this, data);
  }
}
