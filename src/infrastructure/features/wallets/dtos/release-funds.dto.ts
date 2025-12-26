import { ApiProperty } from "@/core/domain/common/docs";
import { TransactionSource } from "@/core/domain/wallet";
import { IsNumber, IsUUID } from "class-validator";

export class ReleaseFundsDto {
  @ApiProperty({ format: "uuid", required: true })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  amount: number;

  @ApiProperty({ format: "string", required: false, default: "XOF" })
  currency?: string;

  @ApiProperty({ required: false, enum: TransactionSource })
  source?: TransactionSource;

  @ApiProperty({ format: "uuid", required: false })
  @IsUUID()
  sourceId?: string;

  @ApiProperty({ required: false })
  note?: string;
}
