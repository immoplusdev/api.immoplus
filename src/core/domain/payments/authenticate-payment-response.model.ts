import { PaymentStatus } from "./payment-status.enum";

export class AuthenticatePaymentIntentResponse {
  id: string;
  status: PaymentStatus;
  token: string;
  constructor(data?: AuthenticatePaymentIntentResponse) {
    Object.assign(this, data);
  }
}
