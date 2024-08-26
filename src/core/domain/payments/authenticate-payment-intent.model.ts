export class AuthenticatePaymentIntent {
  otp: string;
  paymentId: string;
  token: string;

  constructor(data?: AuthenticatePaymentIntent) {
    Object.assign(this, data);
  }
}
