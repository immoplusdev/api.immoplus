export interface Hub2AttemptPayment {
  token: string;
  paymentMethod: string;
  country: string;
  provider: string;
  mobileMoney: MobileMoney;
  onCancelRedirectionUrl: string;
  onFinishRedirectionUrl: string;
}

export interface MobileMoney {
  msisdn: string;
  otp: string;
  onSuccessRedirectionUrl: string;
  onFailedRedirectionUrl: string;
  onCancelRedirectionUrl: string;
  onFinishRedirectionUrl: string;
  workflow: string;
}
