import { PaymentMethod } from "@/core/domain/common/enums";
import { UnexpectedException } from "@/core/domain/common/exceptions";
import {
  HUB2_API_KEY,
  HUB2_ENVIRONMENT,
  HUB2_MERCHANT_ID,
} from "@/infrastructure/configs/payments";

export function formatAmount(amount: number) {
  return Math.ceil(amount / 5) * 5;
}

export function getProviderHub2(paymentMethod: string) {
  switch (paymentMethod.toLocaleLowerCase()) {
    case PaymentMethod.Ecobank:
      return "Ecobank";
    case PaymentMethod.Wave:
      return "wave";
    case PaymentMethod.OrangeMoney:
      return "Orange";
    case PaymentMethod.MoovMoney:
      return "Moov";
    case PaymentMethod.MtnMoney:
      return "MTN";
    default:
      throw new UnexpectedException();
  }
}

export function getHub2PaymentMethod(paymentMethod: string) {
  switch (paymentMethod.toLocaleLowerCase()) {
    case PaymentMethod.Ecobank:
      return "credit_card";
    default:
      return "mobile_money";
  }
}

export function getHeaders() {
  return {
    ApiKey: HUB2_API_KEY,
    MerchantId: HUB2_MERCHANT_ID,
    Environment: HUB2_ENVIRONMENT,
    "Content-type": "application/json",
  };
}

export function getPaymentMethodFees(amount: number, paymentMethod: string) {
  let feesPercentage = 0;
  switch (paymentMethod.toLocaleLowerCase()) {
    case PaymentMethod.Wave:
      feesPercentage = 2;
      break;
    case PaymentMethod.OrangeMoney:
      feesPercentage = 2;
      break;
    case PaymentMethod.MoovMoney:
      feesPercentage = 2;
      break;
    case PaymentMethod.MtnMoney:
      feesPercentage = 2;
      break;
    default:
      break;
  }

  return formatAmount((amount * feesPercentage) / 100);
}

export function getTransferMethodFees(
  amount: number,
  paymentMethod: string,
  format: boolean = true,
) {
  let feesPercentage = 0;
  switch (paymentMethod.toLocaleLowerCase()) {
    case PaymentMethod.Wave:
      feesPercentage = 2;
      break;
    case PaymentMethod.OrangeMoney:
      feesPercentage = 1;
      break;
    case PaymentMethod.MoovMoney:
      feesPercentage = 1;
      break;
    case PaymentMethod.MtnMoney:
      feesPercentage = 1;
      break;
    default:
      break;
  }
  const fees = format
    ? formatAmount((amount * feesPercentage) / 100)
    : (amount * feesPercentage) / 100;

  return fees;
}
