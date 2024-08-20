import { PaymentNextAction } from "@/core/domain/payments";

export class AttemptPaymentIntentResponse {
  id: string;
  status: string;
  token: string;
  nextAction: PaymentNextAction;
  metadata?: Record<string, any>;
  constructor(data?: AttemptPaymentIntentResponse) {
    Object.assign(this, data);
  }
}
