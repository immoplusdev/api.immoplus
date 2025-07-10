import { ApiProperty } from "@/core/domain/common/docs";
import { IsNumber, IsUUID } from "class-validator";

export class ReleaseFundsDto {
    @ApiProperty({ format: "uuid", required: true })
    @IsUUID()
    ownerId: string;

    @ApiProperty({ type: Number, required: true })
    @IsNumber()
    amount: number;

    @ApiProperty({ format: "uuid", required: false })
    @IsUUID()
    reservationId: string;

    @ApiProperty({ required: false, default: "XOF" })
    currency?: string
}