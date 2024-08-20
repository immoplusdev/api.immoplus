import { PaymentStatus } from "./payment-status.enum";

export class CreatePaymentIntentResponse {
  id: string;
  status: PaymentStatus;
  token: string;

  constructor(data?: CreatePaymentIntentResponse) {
    Object.assign(this, data);
  }
}
