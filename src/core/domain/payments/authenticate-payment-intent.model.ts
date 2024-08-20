export class AuthenticatePaymentIntent {
  otp: string;
  payment_id: string;
  token: string;

  constructor(data?: AuthenticatePaymentIntent) {
    Object.assign(this, data);
  }
}
