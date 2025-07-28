import {
  CreatePaymentIntent,
  CreatePaymentIntentResponse, AttemptPaymentIntent,
  PaymentStatus, AttemptPaymentIntentResponse,
  AuthenticatePaymentIntent, AuthenticatePaymentIntentResponse,
  IPaymentGatewayService,
} from "@/core/domain/payments";
import { UnexpectedException } from "@/core/domain/common/exceptions";
import { PaymentToken } from "@/core/domain/payments/payment-token.model";
import {
  HUB2_API_KEY, HUB2_API_URL,
  HUB2_ENVIRONMENT,
  HUB2_MERCHANT_ID,
  HUB2_OVERRIDE_BUSINESS_NAME, HUB2_RETURN_URL,
} from "@/infrastructure/configs/payments";
import { ILoggerService } from "@/core/domain/logging";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import axios, { AxiosError } from "axios";
import {
  Hub2AttemptPaymentResponse,
  Hub2CreatePaymentIntentResponse,
} from "@/infrastructure/features/payments/hub2";
import { ConflictException } from "@/core/domain/common/exceptions";
import { PaymentMethod } from "@/core/domain/common/enums";

@Injectable()
export class Hub2PaymentGatewayService implements IPaymentGatewayService {

  constructor(@Inject(Deps.LoggerService) private readonly loggerService: ILoggerService) {}

  static getWebhookSignatureFromHeaders(headers: Record<string, any>) {
    const header = headers["hub2-signature"]
      ? headers["hub2-signature"]
      : headers["Hub2-Signature"];
    if (!header) return "";
    return header.split(",s0=")[0]?.replace("s1=", "");
  }

  getProviderHub2(paymentMethod: string) {
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

  getHub2PaymentMethod(paymentMethod: string) {
    switch (paymentMethod.toLocaleLowerCase()) {
      case PaymentMethod.Ecobank:
        return "credit_card";
      default:
        return "mobile_money";
    }
  }

  getHeaders() {
    return {
      ApiKey: HUB2_API_KEY,
      MerchantId: HUB2_MERCHANT_ID,
      Environment: HUB2_ENVIRONMENT,
      "Content-type": "application/json",
    };
  }

  getPaymentMethodFees(amount: number, paymentMethod: string) {
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

    return amount * feesPercentage / 100;
  }

  async createPaymentIntent(
    payload: CreatePaymentIntent,
  ): Promise<CreatePaymentIntentResponse> {
    const amount = payload.amount + this.getPaymentMethodFees(payload.amount, payload.paymentMethod || PaymentMethod.Wave);

    try {
      const body = {
        customerReference: payload.customerId,
        purchaseReference: PaymentToken.toString(payload.paymentToken) + new Date().toISOString(),
        amount: Math.ceil(amount),
        currency: "XOF",
        overrideBusinessName: HUB2_OVERRIDE_BUSINESS_NAME,
      };
      // this.loggerService.info("info => ", body);

      const response = await axios.post<Hub2CreatePaymentIntentResponse>(
        `${HUB2_API_URL}/payment-intents`,
        body,
        {
          headers: this.getHeaders(),
        },
      );

      // this.loggerService.info("info => ", response.data);

      const { id, token, status } = response.data;
      return new CreatePaymentIntentResponse({
        id,
        token,
        status,
      });
    } catch (error) {
      this.loggerService.error("error => ", error);
      if (error.response) {
        if (error.response.data) {
          this.loggerService.error("error => ", error.response.data);
        } else {
          this.loggerService.error("error => ", error.response);
        }
      }
      if (error instanceof AxiosError && error.response?.data)
        throw new ConflictException(error.response?.data.message);
      throw new UnexpectedException();
    }
  }

  async attemptPayment(payload: AttemptPaymentIntent) {
    try {
      const body = {
        token: payload.token,
        paymentMethod: this.getHub2PaymentMethod(payload.paymentMethod),
        country: "CI",
        provider: this.getProviderHub2(payload.paymentMethod),
        mobileMoney: {
          msisdn: payload.paymentCredentials.replace("-", ""),
          onSuccessRedirectionUrl: `${HUB2_RETURN_URL}/payment/${payload.collection}/${payload.itemId}?status=${PaymentStatus.Successful}`,
          onFailedRedirectionUrl: `${HUB2_RETURN_URL}/payment/${payload.collection}/${payload.itemId}?status=${PaymentStatus.Failed}`,
        },
      };

      const response = await axios.post<Hub2AttemptPaymentResponse>(
        `${HUB2_API_URL}/payment-intents/${payload.paymentId}/payments`,
        body,
        {
          headers: this.getHeaders(),
        },
      );

      const { id, token, status } = response.data;
      const payments = response.data.payments as any;
      const payment = !payments.length
        ? payments
        : payments[payments.length - 1];

      // metadata?: Record<string, any>;

      return new AttemptPaymentIntentResponse({
        id,
        token,
        status,
        nextAction: payment.nextAction,
      });
    } catch (error) {
      this.loggerService.error("error => ", error);
      if (error instanceof AxiosError && error.response?.data)
        throw new ConflictException(error.response?.data.message);
      throw new UnexpectedException();
    }
  }

  async authenticatePayment(payload: AuthenticatePaymentIntent) {
    try {
      const body = {
        token: payload.token,
        confirmationCode: `${payload.otp}`,
      };

      const response = await axios.post<Hub2AttemptPaymentResponse>(
        `${HUB2_API_URL}/payment-intents/${payload.paymentId}/authentication`,
        body,
        {
          headers: this.getHeaders(),
        },
      );

      const { id, token, status } = response.data;

      return new AuthenticatePaymentIntentResponse({
        id,
        token,
        status: status as PaymentStatus,
      });
    } catch (error) {
      this.loggerService.error("error => ", error);
      if (error instanceof AxiosError && error.response?.data)
        throw new ConflictException(error.response?.data.message);
      throw new UnexpectedException();
    }
  }

  calculatePaymentFees(amount: number, paymentMethod: PaymentMethod) {
    let feesPercentage = 0;

    switch (paymentMethod.toLocaleLowerCase()) {
      case PaymentMethod.Ecobank:
        feesPercentage = 0;
        break;
      case PaymentMethod.Wave:
        feesPercentage = 0;
        break;
      case PaymentMethod.OrangeMoney:
        feesPercentage = 0;
        break;
      case PaymentMethod.MoovMoney:
        feesPercentage = 0;
        break;
      case PaymentMethod.MtnMoney:
        feesPercentage = 0;
        break;
      default:
        feesPercentage = 0;
        break;
    }

    return Math.ceil(amount * feesPercentage / 100);
  }



}
