import { PaymentCollection } from "./payment-collection.enum";
import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";

export class PaymentCollectionItemData {
  @ApiProperty({ format: "uuid" })
  itemId: string;
  @ApiProperty({ enum: PaymentCollection })
  collection: PaymentCollection;
  @ApiProperty()
  amount: number;

  @ApiProperty()
  amountNoFees: number;

  setData(data: OmitMethods<PaymentCollectionItemData>) {
    Object.assign(this, data);
    return this;
  }

  constructor(data?: OmitMethods<PaymentCollectionItemData>) {
    if (data) Object.assign(this, data);
  }
}
