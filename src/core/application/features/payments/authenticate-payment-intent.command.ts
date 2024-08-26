import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentCollection } from "@/core/domain/payments";
import { IsOptional } from "class-validator";

export class AuthenticatePaymentIntentCommand {
  @ApiProperty()
  otp: string;
  @ApiProperty({ format: "uuid" })
  itemId: string;
  @ApiProperty({ enum: PaymentCollection })
  collection: PaymentCollection;
  @IsOptional()
  userId: string;

  constructor(data?: OmitMethods<AuthenticatePaymentIntentCommand>) {
    if (data) Object.assign(this, data);
  }
}
