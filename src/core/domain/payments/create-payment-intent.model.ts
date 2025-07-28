import { PaymentMethod } from "../common/enums";
import { PaymentToken } from "./payment-token.model";

export class CreatePaymentIntent {
  customerId: string;
  paymentToken: PaymentToken;
  amount: number;
  paymentMethod?: PaymentMethod;
  constructor(data?: CreatePaymentIntent) {
    Object.assign(this, data);
  }
}
