import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaymentCollection, PaymentMethod } from "@/core/domain/payments";

export class CreatePaymentIntentCommand {
  @ApiProperty({ enum: PaymentCollection })
  collection: PaymentCollection;
  @ApiProperty({ format: "uuid" })
  itemId: string;
  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;
  @ApiProperty({ description: "Phone number or credit card credentials" })
  paymentCredentials: string;
  @IsOptional()
  userId: string;

  constructor(data?: OmitMethods<CreatePaymentIntentCommand>) {
    if (data) Object.assign(this, data);
  }
}
