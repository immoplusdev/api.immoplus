import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentCollection } from "@/core/domain/payments";

export class GetPaymentCollectionItemDataQuery {
  @ApiProperty({ format: "uuid" })
  itemId: string;
  @ApiProperty({ enum: PaymentCollection })
  collection: PaymentCollection;

  constructor(data?: OmitMethods<GetPaymentCollectionItemDataQuery>) {
    if (data) Object.assign(this, data);
  }
}
