import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { required } from "joi";

export class CreateTransferDto {
  @ApiProperty({ type: String, required: true, format: "uuid" })
  @IsUUID()
  walletWithDrawalRequestId: string;

  @ApiProperty({ type: String, required: false })
  description?: string;
}
