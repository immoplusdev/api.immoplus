import { CreatePaymentIntent } from "./create-payment-intent.model";
import { CreatePaymentIntentResponse } from "./create-payment-intent-response.model";
import { AttemptPaymentIntent } from "./attempt-payment-intent.model";
import { AttemptPaymentIntentResponse } from "./attempt-payment-intent-response.model";
import { AuthenticatePaymentIntent } from "./authenticate-payment-intent.model";
import { AuthenticatePaymentIntentResponse } from "./authenticate-payment-response.model";
import { PaymentMethod } from "../common/enums";

export interface IPaymentGatewayService {
  createPaymentIntent(
    payload: CreatePaymentIntent,
  ): Promise<CreatePaymentIntentResponse>;

  attemptPayment(
    command: AttemptPaymentIntent,
  ): Promise<AttemptPaymentIntentResponse>;

  authenticatePayment(
    command: AuthenticatePaymentIntent,
  ): Promise<AuthenticatePaymentIntentResponse>;

  calculatePaymentFees(amount: number, paymentMethod: PaymentMethod): number;

  // abstract getProviders(): Promise<PaymentProvider[]>;
}