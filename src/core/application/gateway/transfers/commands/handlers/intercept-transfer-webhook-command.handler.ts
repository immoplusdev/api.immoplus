import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { InterceptTransferWebhookCommand } from "../intercept-transfer-webhook.command";
import { InterceptTransferWebhookCommandResponse } from "../../../intercept-transfer-webhook-command.response";
import crypto from "crypto";
import { ILoggerService } from "@/core/domain/logging";
import { AccessForbiddenException } from "@/core/domain/auth";
import { Deps } from "@/core/domain/common/ioc";
import { Inject } from "@nestjs/common";
import {
  IPaymentGatewayService,
  IPaymentRepository,
  PaymentCollection,
  PaymentStatus,
  StatusFacture,
} from "@/core/domain/payments";
import { IReservationRepository, Reservation, StatusReservation } from "@/core/domain/reservations";
import { DemandeVisite, IDemandeVisiteRepository, StatusDemandeVisite } from "@/core/domain/demandes-visites";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { PaymentDemandeVisiteValideEvent } from "@/core/application/payments/payment-demande-visite-valide.event";
import { PaymentReservationValideEvent } from "@/core/application/payments/payment-reservation-valide.event";
import { IResidenceRepository, Residence } from "@/core/domain/residences";
import {  DEFAULT_CURRENCY, IWalletRepository, TransactionSource, WalletWithDrawalRequest, WithdrawalStatus } from "@/core/domain/wallet";
import { WalletsService } from "@/infrastructure/features/wallets/wallet.service";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { INotificationService } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { PaymentMethod } from "@/core/domain/common/enums";
import { ITransferRepository } from "@/core/domain/transfers/i-transfer.repository";
import { TransferItemType, TransferStatus } from "@/core/domain/transfers/transfer.enum";

@CommandHandler(InterceptTransferWebhookCommand)
export class InterceptTransferWebhookCommandHandler implements ICommandHandler<InterceptTransferWebhookCommand> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
    @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository,
    @Inject(Deps.NotificationService) private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService) private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.TransferRepository) private readonly transferRepository: ITransferRepository,
    private readonly eventBus: EventBus,
  ) {
    //
  }

  async execute(command: InterceptTransferWebhookCommand): Promise<InterceptTransferWebhookCommandResponse> {
    if (!this.hasAccess(command.json, command.signature))
      throw new AccessForbiddenException();

    try {
        await this.updateTransferStatus(command);
    } catch (error) {
        this.loggerService.error(error);
    }
    return new InterceptTransferWebhookCommandResponse();
  }

  hasAccess(json: string, reqHmac: string) {
    return true;
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

  getTransferStatus(status: string): TransferStatus {
    switch (status) {
      case "successful":
        return TransferStatus.SUCCESSFUL;
      case "failed":
        return TransferStatus.FAILED;
      case "created":
        return TransferStatus.CREATED;
      case "pending":
        return TransferStatus.PENDING;
      default:
        return TransferStatus.PENDING;
    }
  }

  async updateTransferStatus(command: InterceptTransferWebhookCommand) {
    if (!command.type?.includes("transfer")) return;

    const { data: localTransfers } = await this.transferRepository.findByQuery({
      _where: [
        {
          _field: "hub2_transfer_id",
          _val: command.data.id,
        },
      ],
      _order_by: 'created_at',
      _order_dir: 'desc'
    });


    if (localTransfers.length == 0) throw new ItemNotFoundException();

    const localTransfer = localTransfers[0];
    const transferStatus = this.getTransferStatus(command.data.status);

    await this.transferRepository.updateOne(localTransfer.id, {
      transfetStatus: transferStatus,
      hub2Metadata: command.json as never,
    });

    if (transferStatus == TransferStatus.SUCCESSFUL || transferStatus == TransferStatus.FAILED) {
      await this.updateSourceItemStatus(localTransfer.itemType, localTransfer.itemId, transferStatus);
    }
     
    const operator = command.data?.destination?.provider;
    const phoneNumber = command.data?.destination?.number;
    const paymentStatus = command.data?.status;
  

    // Si tranfer reussi, faire verfication pour debiter le wallet
    if (transferStatus == TransferStatus.SUCCESSFUL) {
        const cunstomerId = typeof localTransfer.customer == 'object' ? localTransfer.customer.id : localTransfer.customer;
        await this.debitWallet(localTransfer.itemType, localTransfer.itemId, cunstomerId, localTransfer.amount, operator);
    }

  }

  async updateSourceItemStatus(itemtype : string, itemId: string, status: TransferStatus) {
    switch (itemtype) {
      case TransferItemType.WALLET_WITHDRAWAL_REQUEST:
        const walletWithdrawalRequest: WalletWithDrawalRequest = await this.walletRepository.findWalletWithdrawalRequestById(itemId);
        await this.walletRepository.updateWalletWithdrawalRequest(walletWithdrawalRequest.id, {status: this.getWithdrawalStatus(status)});
        break;
      default:
        break;
    }
  }



  async debitWallet(source: string, sourceId: string,customerId: string, amount: number, operator?: PaymentMethod) {
      const note = "Retrait de fonds";
      const walletSource = this.getWalletSource(source);  
      const wallet = await this.walletRepository.debitWallet(
        customerId, 
        amount, 
        DEFAULT_CURRENCY, 
        walletSource, 
        sourceId, 
        operator,
        note
      );

      if(wallet) {
        // TODO : Envoyer une notification au proprietaire pour lui indiquer que son solde a bien ete crediter
        await this.notificationService.sendNotification({
          userId: customerId,
          subject: this.globalizationService.t("all.notifications.wallets.paiement_debit_pro.subject"),
          message: this.globalizationService.t("all.notifications.wallets.paiement_debit_pro.message"),
          skipInAppNotification: false,
          sendMail: true,
          sendSms: true,
          returnUrl: ``
        });
      }
      
  }

  getWalletSource(source: string): TransactionSource {
    switch (source) {
      case TransferItemType.ADMIN_WITHDRAWAL:
        return TransactionSource.DEMANDE_RETRAIT_ADMIN;
      case TransferItemType.WALLET_WITHDRAWAL_REQUEST:
        return TransactionSource.DEMANDE_RETRAIT;
      default:
        return TransactionSource.AUTRE;
    }
  }

  getWithdrawalStatus(status: string): WithdrawalStatus {
    switch (status) {
      case TransferStatus.SUCCESSFUL:
        return WithdrawalStatus.COMPLETED;
      case TransferStatus.FAILED:
        return WithdrawalStatus.FAILED;
      default:
        return WithdrawalStatus.PENDING;
    }
  }
  
}
