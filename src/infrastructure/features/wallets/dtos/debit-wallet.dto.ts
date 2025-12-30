import { ApiProperty } from "@/core/domain/common/docs";
import { PaymentMethod } from "@/core/domain/common/enums";
import { TransactionSource } from "@/core/domain/wallet";
import { IsNumber, IsUUID } from "class-validator";

export class DebitWalletDto {
  @ApiProperty({ format: "uuid", required: true })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TransactionSource, required: false })
  source?: TransactionSource;

  @ApiProperty({ format: "uuid", required: false })
  @IsUUID()
  sourceId?: string;

  @ApiProperty({ required: false, default: "XOF" })
  currency?: string;

  @ApiProperty({ enum: PaymentMethod, required: false })
  operator?: PaymentMethod;

  @ApiProperty({ type: String, required: false })
  note?: string;
}
