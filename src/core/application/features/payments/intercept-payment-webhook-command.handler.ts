import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InterceptPaymentWebhookCommand } from "./intercept-payment-webhook.command";
import { InterceptPaymentWebhookCommandResponse } from "./intercept-payment-webhook-command.response";
import crypto from "crypto";
import { HUB2_ENVIRONMENT, HUB2_WEBHOOK_SECRET, SIMULATE_PAYMENT } from "@/infrastructure/configs/payments";
import { PaymentEnv } from "@/core/domain/payments/payment-env.enum";
import { ILoggerService } from "@/core/domain/logging";
import { AccessForbiddenException } from "@/core/domain/auth";
import { Deps } from "@/core/domain/shared/ioc";
import { Inject } from "@nestjs/common";
import {
  IPaymentGatewayService,
  IPaymentRepository,
  PaymentCollection,
  PaymentStatus,
  StatusFacture,
} from "@/core/domain/payments";
import { IReservationRepository } from "@/core/domain/reservations";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";

@CommandHandler(InterceptPaymentWebhookCommand)
export class InterceptPaymentWebhookCommandHandler implements ICommandHandler<InterceptPaymentWebhookCommand> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.PaymentRepository) private readonly paymentRepository: IPaymentRepository,
    @Inject(Deps.PaymentGatewayService) private readonly paymentGatewayService: IPaymentGatewayService,
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
  ) {
    //
  }

  async execute(
    command: InterceptPaymentWebhookCommand,
  ): Promise<InterceptPaymentWebhookCommandResponse> {
    if (!this.hasAccess(command.json, command.signature))
      throw new AccessForbiddenException();
    try {
      await this.updatePaymentStatus(command);
    } catch (error) {
      this.loggerService.error(error);
    }
    return new InterceptPaymentWebhookCommandResponse();
  }

  hasAccess(json: string, reqHmac: string) {
    if (SIMULATE_PAYMENT || HUB2_ENVIRONMENT == PaymentEnv.Sandbox) return true;

    try {
      const hmac = this.createHmacSignature(
        json,
        HUB2_WEBHOOK_SECRET,
      );
      return this.compareSignatures(hmac, reqHmac);
    } catch (error) {
      this.loggerService.error(error);
      return false;
    }
  }

  createHmacSignature(json: string, secret: string) {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(json);
    return hmac.digest("hex");
  }

  compareSignatures(signature: string, comparisonSignature: string) {
    const source = Buffer.from(signature);
    const comparison = Buffer.from(comparisonSignature);
    return crypto.timingSafeEqual(source, comparison);
  }

  getPaymentStatus(status: string): PaymentStatus {
    switch (status) {
      case "successful":
        return PaymentStatus.Successful;
      case "failed":
        return PaymentStatus.Failed;
      case "processing":
        return PaymentStatus.Processing;
      case "pending":
        return PaymentStatus.Processing;
      default:
        return PaymentStatus.Processing;
    }
  }

  async updatePaymentStatus(command: InterceptPaymentWebhookCommand) {
    if (!command.type?.includes("payment_intent")) return;

    const { data: localPayments } = await this.paymentRepository.findByQuery({
      _where: [
        {
          _field: "hub2Token",
          _val: command.token,
        },
      ],
    });

    const paymentWebhookData = command.payments.sort((a, b) => {
      return (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any);
    })[0];

    if (localPayments.length == 0 || paymentWebhookData == undefined) throw new ItemNotFoundException();

    const localPayment = localPayments[localPayments.length - 1];
    const paymentStatus = this.getPaymentStatus(command.status);
    const previousNextAction = localPayment.hub2NextAction ? JSON.stringify(localPayment.hub2NextAction) : null;
    const nextAction = command.nextAction ? JSON.stringify(command.nextAction) : previousNextAction;

    await this.paymentRepository.updateOne(localPayment.id, {
      paymentStatus: paymentStatus,
      hub2NextAction: paymentStatus != PaymentStatus.Successful && paymentStatus != PaymentStatus.Failed ? nextAction as never : null,
      hub2Metadata: command.json as never,
    });

    if (paymentStatus == PaymentStatus.Successful || paymentStatus == PaymentStatus.Failed) {
      const statusFacture = paymentStatus == PaymentStatus.Successful ? StatusFacture.Paye : StatusFacture.NonPaye;
      await this.updateItemStatusFacture(localPayment.itemId, localPayment.collection, statusFacture);
    }
  }

  async updateItemStatusFacture(itemId: string, collection: PaymentCollection, statusFacture: StatusFacture) {
    switch (collection) {
      case PaymentCollection.Reservation:
        await this.reservationRepository.updateOne(itemId, {
          statusFacture,
        });
        break;
      case PaymentCollection.DemandeDeVisite:
        await this.demandeVisiteRepository.updateOne(itemId, {
          statusFacture,
        });
        break;
      default:
        break;
    }
  }
}
