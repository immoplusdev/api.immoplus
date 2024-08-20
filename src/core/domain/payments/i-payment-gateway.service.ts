import { CreatePaymentIntent } from "./create-payment-intent.model";
import { CreatePaymentIntentResponse } from "./create-payment-intent-response.model";
import { AttemptPaymentIntent } from "./attempt-payment-intent.model";
import { AttemptPaymentIntentResponse } from "./attempt-payment-intent-response.model";
import { AuthenticatePaymentIntent } from "./authenticate-payment-intent.model";
import { AuthenticatePaymentIntentResponse } from "./authenticate-payment-response.model";
import { PaymentMethod } from "./payment-method.enum";

export abstract class IPaymentGatewayService {
  abstract createPaymentIntent(
    payload: CreatePaymentIntent,
  ): Promise<CreatePaymentIntentResponse>;

  abstract attemptPayment(
    command: AttemptPaymentIntent,
  ): Promise<AttemptPaymentIntentResponse>;

  abstract authenticatePayment(
    command: AuthenticatePaymentIntent,
  ): Promise<AuthenticatePaymentIntentResponse>;

  abstract calculatePaymentFees(amount: number, paymentMethod: PaymentMethod): number;

  // abstract getProviders(): Promise<PaymentProvider[]>;
}