import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class WalletWithdrawalRequestDto {
    @ApiProperty({ format: "uuid", required: true })
    @IsUUID()
    id: string;

    @ApiProperty({ type: Number, required: true })
    amount: number;

    @ApiProperty({ type: String, required: true, default: "XOF" })
    currency: string;

    @ApiProperty({ type: String, required: true })
    status: string;


    @ApiProperty({ type: String, required: false})
    note?: string;

    @ApiProperty({ type: Date, required: true})
    createdAt: Date;

    @ApiProperty({ type: Date, required: true})
    updatedAt: Date;

    @ApiProperty({ type: Date, required: true})
    deletedAt?: Date;

    @ApiProperty({ type: String, required: false})
    createdBy?: string;

    @ApiProperty({ format: "uuid", required: true })
    @IsUUID()
    owner:  string;
}

export class WrapperResponseWalletWithdrawalRequestBatchDto extends WrapperResponseDto<WalletWithdrawalRequestDto[]> {
  @ApiProperty({ type: [WalletWithdrawalRequestDto] })
  data: WalletWithdrawalRequestDto[];
}

export class WrapperResponseWalletWithdrawalRequestDto {
  @ApiProperty({ type: WalletWithdrawalRequestDto })
  data: WalletWithdrawalRequestDto;
}
    