import { PaymentStatus, PaymentNextAction } from "@/core/domain/payments";

export interface Hub2CreatePaymentIntentResponse {
  id: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
  token: string;
  purchaseReference: string;
  customerReference: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  payments: Payments;
  mode: string;
  nextAction: PaymentNextAction;
  lastPaymentFailure: Failure;
  overrideBusinessName: string;
}

export interface Failure {
  code: string;
  message: string;
  params: string[];
}

// export interface NextAction {
//   type: string;
//   message: string;
//   data: NextActionData;
// }

// export interface NextActionData {
//   url: string;
//   method: string;
//   headers: Record<string, any>;
//   data: Record<string, any>;
// }

export type Payments = {
  id: string;
  intentId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
  country: string;
  failure: Failure;
  fees: Fee[];
  nextAction: PaymentNextAction;
  onCancelRedirectionUrl: string;
  onFinishRedirectionUrl: string;
}[]

export interface Fee {
  id: string;
  rate: number;
  rateType: string;
  amount: number;
  currency: string;
  label: string;
}
