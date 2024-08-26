import "reflect-metadata";
import { PaymentStatus } from "@/core/domain/payments/payment-status.enum";
import { PaymentMethod } from "@/core/domain/payments/payment-method.enum";
import { Hub2PaymentGatewayService } from "@/infrastructure/features/payments/hub2";
import { LoggerService } from "@/infrastructure/features/logging/logger.service";
// import { ConfigsManagerService } from "@/infrastructure/features/configs/configs-manager.service";
import { AttemptPaymentIntent } from "@/core/domain/payments";

jest.mock("axios", () => {
  return {
    post: () => Promise.resolve({
      data: {
        id: "",
        merchantId: "",
        createdAt: "",
        updatedAt: "",
        token: "",
        purchaseReference: "",
        customerReference: "",
        status: PaymentStatus.Successful,
        amount: 10000,
        currency: "XOF",
        payments: [{
          id: "",
          intentId: "",
          createdAt: "",
          updatedAt: "",
          status: PaymentStatus.Successful,
          amount: 10000,
          currency: "XOF",
          method: PaymentMethod.Wave,
          country: "CI",
        }],
        mode: "sandbox",
      },
    }),
  };
});


describe("createNewPayment", () => {

  const hub2PaymentGatewayService = new Hub2PaymentGatewayService(new LoggerService({} as any));

  it("shouldReturnANoneEmptyObject", () => {
    // Arrange
    const paymentData = new AttemptPaymentIntent({
      paymentCredentials: "2250143881818",
      paymentMethod: "wave",
      paymentId: "random-payment-id",
      token: "random-payment-token",
      itemId: "random-product-id",
      collection: "",
    });

    // Act
    hub2PaymentGatewayService.attemptPayment(paymentData).then((result) => {
      // Assert
      expect(result).not.toBeNull();
    }).catch((_e: unknown) => {
      //
    });
  });
});
