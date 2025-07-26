export interface Hub2AttemptPaymentResponse {
  id: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
  token: string;
  purchaseReference: string;
  customerReference: string;
  status: string;
  amount: number;
  currency: string;
  payments: Payments | Payments[];
  mode: string;
  nextAction: NextAction;
  lastPaymentFailure: LastPaymentFailure;
  overrideBusinessName: string;
}

export interface LastPaymentFailure {
  code: string;
  message: string;
  params: any[];
}

interface NextAction {
  type: string;
  message: string;
  data: Data;
}

interface Data {
  url: string;
  method: string;
  headers: Record<string, any>;
  data: Record<string, any>;
}

interface Payments {
  id: string;
  intentId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
  country: string;
  failure: Record<string, any>;
  fees: any[];
  nextAction: NextAction;
  onCancelRedirectionUrl: string;
  onFinishRedirectionUrl: string;
}
