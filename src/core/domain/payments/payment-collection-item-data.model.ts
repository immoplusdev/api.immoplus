import { PaymentCollection } from "./payment-collection.enum";
import { OmitMethods } from "@/lib/ts-utilities";

export class PaymentCollectionItemDataModel {
  itemId: string;
  collection: PaymentCollection;
  amount: number;

  setData(data: OmitMethods<PaymentCollectionItemDataModel>) {
    Object.assign(this, data);
    return this;
  }

  constructor(data?: OmitMethods<PaymentCollectionItemDataModel>) {
    if (data) Object.assign(this, data);
  }
}
