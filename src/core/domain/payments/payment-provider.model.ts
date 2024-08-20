export class PaymentProvider {
  id: string;
  name: string;
  country: string;
  method: string;
  currency: string;
  constructor(data?: PaymentProvider) {
    Object.assign(this, data);
  }
}
