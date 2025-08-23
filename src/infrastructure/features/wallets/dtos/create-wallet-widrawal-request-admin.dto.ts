import { PaymentMethod } from "@/core/domain/common/enums";
import { WithdrawalStatus } from "@/core/domain/wallet";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID } from "class-validator";

export class CreateWalletWithdrawalRequestAdminDto {
  @ApiProperty({ format: "uuid", required: true })
  @IsUUID()
  owner: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false, default: "XOF" })
  currency: string;

  @ApiProperty({ required: true })
  phoneNumber: string;

  @ApiProperty({ required: true, type: String, enum: PaymentMethod })
  operator: PaymentMethod;

  @ApiProperty({
    required: false,
    type: String,
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;

  @ApiProperty({ required: false })
  note?: string;
}
