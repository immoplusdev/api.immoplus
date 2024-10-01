import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import {
  PaymentCollection,
  PaymentMethod,
  PaymentNextAction,
  PaymentStatus,
  PaymentType,
} from "@/core/domain/payments";

export class PaymentDto {
  @ApiProperty({ format: "uuid" })
  id: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  amountNoFees: number;
  @ApiProperty({ format: "uuid" })
  customer: string;
  @ApiProperty({ enum: PaymentType })
  paymentType: PaymentType;
  @ApiProperty({ enum: PaymentCollection })
  collection: PaymentCollection;
  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;
  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;
  @ApiProperty({ format: "uuid" })
  itemId: string;

  // Hub2 Fields
  @ApiProperty({ format: "uuid" })
  hub2PaymentId?: string;
  @ApiProperty()
  hub2Exception?: string;
  @ApiProperty({ type: () => PaymentNextAction })
  hub2NextAction?: PaymentNextAction;
  @ApiProperty({ format: "uuid" })
  hub2Token?: string;
  @ApiProperty()
  hub2Metadata?: Record<string, any>;

  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty({ format: "uuid" })
  createdBy?: string;

  constructor(data?: OmitMethods<PaymentDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponsePaymentDto extends WrapperResponseDto<PaymentDto> {
  @ApiProperty({ type: PaymentDto })
  data: PaymentDto;
}

export class WrapperResponsePaymentListDto extends WrapperResponseDto<PaymentDto[]> {
  @ApiProperty({ type: [PaymentDto] })
  data: PaymentDto[];
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  hasPrevious: boolean;
  @ApiProperty()
  hasNext: boolean;
}

