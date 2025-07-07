import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { InterceptPaymentWebhookCommand } from "./intercept-payment-webhook.command";
import { InterceptPaymentWebhookCommandResponse } from "./intercept-payment-webhook-command.response";
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
import {  TransactionSource } from "@/core/domain/wallet";
import { WalletsService } from "@/infrastructure/features/wallets/wallet.service";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";

@CommandHandler(InterceptPaymentWebhookCommand)
export class InterceptPaymentWebhookCommandHandler implements ICommandHandler<InterceptPaymentWebhookCommand> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.PaymentRepository) private readonly paymentRepository: IPaymentRepository,
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
    @Inject(Deps.ResidenceRepository) private readonly residenceRepository: IResidenceRepository,
    @Inject(Deps.WalletsService) private readonly walletService: WalletsService,
    private readonly eventBus: EventBus,
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
      await this.updateItemStatusAndStatusFacture(localPayment.itemId, localPayment.collection, statusFacture);
    }

    // Si payment de la reservation reussi, faire verfication pour crediter le wallet
    if (paymentStatus == PaymentStatus.Successful && localPayment.collection == PaymentCollection.Reservation) {
        const reservation: Reservation = await this.reservationRepository.findOne(localPayment.itemId);

        if(reservation) {
          // Si le montant paye est superieur au 90% du montant total de la reservation
          const amountPlusCommission = reservation.montantTotalReservation * 90 / 100;
          if (amountPlusCommission <= command.amount) {
              const residence : Residence = await this.residenceRepository.findOne(localPayment.itemId);
              
              if(residence){
                
                const refundDate = new Date(reservation.dateDebut); // Date de debut de la reservation
                refundDate.setDate(refundDate.getDate() + 1);     // Ajouter 1 jour a la date

                // Calcul montant à reverser
                const amountToRefund = reservation.montantTotalReservation - reservation.montantCommission;
                if(amountToRefund <= 0) return;

                // Crediter le proprietaire
                const proprietaireWallet = await this.walletService.creditWallet(residence.proprietaire, amountToRefund, TransactionSource.RESERVATION, reservation.id, refundDate);
                if(proprietaireWallet) {
                  // TODO : Envoyer une notification au proprietaire pour lui indiquer que son solde a bien ete crediter

                }
                
              }
          }
          
        }
    }

    // Si payment de la demande de visite reussi, faire verfication pour crediter le wallet
    if (paymentStatus == PaymentStatus.Successful && localPayment.collection == PaymentCollection.DemandeDeVisite) {
      const demandeVisite: DemandeVisite = await this.demandeVisiteRepository.findOne(localPayment.itemId);
      const bien : BienImmobilier = demandeVisite.bienImmobilier as BienImmobilier;;

      if (!demandeVisite) throw new ItemNotFoundException();

      const refundDate = new Date(); // Date du jour
      refundDate.setDate(refundDate.getDate() + 1); // Date de demain

      // Calcul montant à reverser
      const amountToRefund = demandeVisite.montantTotalDemandeVisite - demandeVisite.montantCommission;
      if(amountToRefund <= 0) return;
      // Crediter le proprietaire
      const proprietaireWallet = await this.walletService.creditWallet(bien.proprietaire, amountToRefund, TransactionSource.DEMANDE_VISITE, demandeVisite.id, refundDate);
      if(proprietaireWallet) {
        // TODO : Envoyer une notification au proprietaire pour lui indiquer que son solde a bien ete crediter

      }
      


    }

  }

  async updateItemStatusAndStatusFacture(itemId: string, collection: PaymentCollection, statusFacture: StatusFacture) {
    switch (collection) {
      case PaymentCollection.Reservation:
        await this.reservationRepository.updateOne(itemId, {
          statusFacture,
          statusReservation: StatusReservation.Valide
        });

        break;
      case PaymentCollection.DemandeDeVisite:
        await this.demandeVisiteRepository.updateOne(itemId, {
          statusFacture,
          statusDemandeVisite: StatusDemandeVisite.Valide
        });
        if (statusFacture == StatusFacture.Paye) this.eventBus.publish(new PaymentDemandeVisiteValideEvent({ demandeVisiteId: itemId }));
        break;
      default:
        break;
    }

    }


  
}
