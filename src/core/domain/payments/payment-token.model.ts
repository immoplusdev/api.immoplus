import { PaymentCollection } from "@/core/domain/payments";
import { OmitMethods } from "@/lib/ts-utilities";

export class PaymentToken {
  collection: PaymentCollection;
  itemId: string;

  static fromString(string: string) {
    const items = string.split("_");
    return new PaymentToken({
      collection: items[0] as never,
      itemId: items[1] as never,
    });
  }

  static toString(data: OmitMethods<PaymentToken>) {
    return `${data.collection}_${data.itemId}`;
  }

  constructor(data?: OmitMethods<PaymentToken>) {
    if (data) Object.assign(this, data);
  }
}
