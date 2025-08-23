import { TransactionType } from "@/core/domain/wallet";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class WalletTransactionDto {
  @ApiProperty({ format: "uuid", required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ format: "uuid", required: true })
  @IsUUID()
  owner: string;

  @ApiProperty({ type: Number, required: true })
  amount: number;

  @ApiProperty({ type: String, required: true, default: "XOF" })
  currency: string;

  @ApiProperty({ type: String, required: true })
  reference: string;

  @ApiProperty({ type: String, required: true, enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ type: String, required: false })
  note?: string;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;

  @ApiProperty({ type: Date, required: true })
  deletedAt?: Date;

  @ApiProperty({ type: String, required: false })
  createdBy?: string;

  @ApiProperty({ type: Date, required: false })
  releaseDate?: Date;

  @ApiProperty({ type: Boolean, required: false })
  isRealeased?: boolean;

  @ApiProperty({ type: Date, required: false })
  releasedAt?: Date;
}

export class WrapperResponseWalletTransactionbatchDto extends WrapperResponseDto<
  WalletTransactionDto[]
> {
  @ApiProperty({ type: [WalletTransactionDto] })
  data: WalletTransactionDto[];
}

export class WrapperResponseWalletTransactionDto {
  @ApiProperty({ type: WalletTransactionDto })
  data: WalletTransactionDto;
}
