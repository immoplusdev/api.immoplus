import { PaymentMethod } from "@/core/domain/common/enums";
import { TransferItemType, TransferStatus, TransferType } from "@/core/domain/transfers/transfer.enum";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID } from "class-validator";

export class TransferDto {
    @ApiProperty({ format: "uuid", required: true })
    @IsUUID()
    id: string;
    @ApiProperty({ format: "number", required: true })
    @IsNumber()
    amount: number;
    @ApiProperty({type: String, format: "string", required: false, default: "XOF" })
    currency: string;

    @ApiProperty({type: String, format: "string", required: false })
    amountNoFees?: number;
    
    @ApiProperty({type: String, format: "string", required: false })
    customer?:  string; 

    @ApiProperty({ format: "string", required: false, type: String, enum: TransferItemType })
    itemType: TransferItemType;

    @ApiProperty({ format: "string", required: false })
    itemId?: string;

    @ApiProperty({ format: "string", required: false, type: String, enum: TransferStatus, default: TransferStatus.PENDING })
    transfetStatus: TransferStatus

    @ApiProperty({ format: "string", required: false, type: String, enum: TransferType })
    transferType: TransferType;

    @ApiProperty({type: String, format: "string", required: true, default: "CI" })
    country: string;

    @ApiProperty({ format: "string", required: false })
    accountNumber?: string;

    @ApiProperty({ format: "string", required: false })
    bank?: Record<string, any>;

    @ApiProperty({ format: "string", required: false })
    recipientName?: string;

    @ApiProperty({ format: "string", required: false, type: String, enum: PaymentMethod })
    transferProvider?: PaymentMethod;
    
    @ApiProperty({ format: "string", required: false })
    hub2TransferId?: string;

    @ApiProperty({type: String, format: "string", required: false })
    hub2Exception?: string;

    @ApiProperty({type: Object, format: "string", required: false })
    hub2Metadata?: Record<string, any>;

    @ApiProperty({type: String, format: "string", required: false })
    createdBy?: string

    @ApiProperty({type: Date, format: "string", required: false })
    createdAt?: Date

    @ApiProperty({type: Date, format: "string", required: false })
    updatedAt?: Date

    @ApiProperty({type: Date, format: "string", required: false })
    deletedAt?: Date
}

export class WrapperResponseTransferDto extends WrapperResponseDto<TransferDto> {
  @ApiProperty({ type: TransferDto })
  data: TransferDto;
}

export class WrapperResponseTransferListDto extends WrapperResponseDto<TransferDto[]> {
  @ApiProperty({ type: [TransferDto] })
  data: TransferDto[];
}