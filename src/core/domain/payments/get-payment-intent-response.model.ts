export class GetPaymentIntentResponse {
  customer_id: string;
  order_id: string;
  amount: number;

  constructor(data?: GetPaymentIntentResponse) {
    Object.assign(this, data);
  }
}
