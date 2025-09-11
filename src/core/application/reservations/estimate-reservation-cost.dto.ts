import { ApiProperty } from "@/core/domain/common/docs";
import { PaymentMethod } from "@/core/domain/common/enums";
import { OmitMethods } from "@/lib/ts-utilities";

export class EstimateReservationCostDto {
  @ApiProperty({ format: "uuid" })
  residenceId: string;
  @ApiProperty({
    required: true,
    description: "Date de début de la réservation",
    default: new Date(),
  })
  dateDebut: Date | string;
  @ApiProperty({
    required: true,
    description: "Date de fin de la réservation",
    default: new Date(),
  })
  dateFin: Date | string;
  @ApiProperty({
    enum: PaymentMethod,
    enumName: "PaymentMethod",
  })
  paymentMethod: PaymentMethod;

  constructor(data?: OmitMethods<EstimateReservationCostDto>) {
    if (data) Object.assign(this, data);
  }
}
