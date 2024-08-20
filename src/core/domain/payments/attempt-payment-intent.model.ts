export class AttemptPaymentIntent {
  paymentCredentials: string;
  paymentMethod: string;
  paymentId: string;
  token: string;
  itemId: string;
  collection: string;

  constructor(data?: AttemptPaymentIntent) {
    Object.assign(this, data);
  }
}
