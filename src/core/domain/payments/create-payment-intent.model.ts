import { PaymentToken } from "./payment-token.model";
import {PaymentMethod} from "./payment-method.enum";

export class CreatePaymentIntent {
  customerId: string;
  paymentToken: PaymentToken;
  amount: number;
  paymentMethod?: PaymentMethod;
  constructor(data?: CreatePaymentIntent) {
    Object.assign(this, data);
  }
}
