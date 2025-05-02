import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { PaymentStatus } from "@/core/domain/payments";

export class UpdatePaymentDto {
  @ApiProperty({ enum: PaymentStatus, enumName: "PaymentStatus" })
  paymentStatus: PaymentStatus;
  constructor(data?: OmitMethods<UpdatePaymentDto>) {
    if (data) Object.assign(this, data);
  }
}
