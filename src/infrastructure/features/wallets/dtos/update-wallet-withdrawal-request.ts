import { WithdrawalStatus } from "@/core/domain/wallet";
import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { IsNumber } from "class-validator";

export class UpdateWalletWithdrawalRequestDto {
    @ApiProperty({ format: "number", required: false })
    amount: number;

    @ApiProperty({ required: false, default: "XOF" })
    currency: string;

    @ApiProperty({ required: false, type: String, enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
    status: WithdrawalStatus;

    @ApiProperty({ required: false })
    note?: string;
}