import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Deps } from "@/core/domain/common/ioc";
import {
  IReservationRepository,
  Reservation,
  StatusReservation,
} from "@/core/domain/reservations";
import { ILoggerService } from "@/core/domain/logging";
import * as moment from "moment";
import { StatusFacture } from "@/core/domain/payments";
import { PaymentMethod } from "@/core/domain/common/enums";
import { DEFAULT_CURRENCY, TransactionSource } from "@/core/domain/wallet";
import { IResidenceRepository, Residence } from "@/core/domain/residences";
import { IGlobalizationService } from "@/core/domain/globalization";
import { WalletsService } from "../wallets/wallet.service";
import {
  INotificationService,
  PushNotificationType,
} from "@/core/domain/notifications";
import { identity } from "rxjs";

@Injectable()
export class ReservationService {
  constructor(
    @Inject(Deps.LoggerService)
    private readonly loggerService: ILoggerService,
    @Inject(Deps.ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.WalletsService)
    private readonly walletService: WalletsService,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  // @Cron("0 */12 * * *")
  async refreshReservationStatus() {
    this.loggerService.info("Refreshing reservation status");
    const reservations = await this.reservationRepository.findByQuery({
      _where: [
        {
          _field: "statusReservation",
          _op: "neq",
          _val: StatusReservation.Terminee,
        },
        { _field: "statusFacture", _op: "eq", _val: StatusFacture.Paye },
      ],
    });

    const reservationIds = [];
    const today = moment().format("YYYY-MM-DD");

    for (const reservation of reservations.data) {
      const dateReservation = reservation.datesReservation
        .sort((item1, item2) => moment(item1.date).diff(moment(item2.date)))
        .map((item) => item.date)[0];

      if (dateReservation && moment(dateReservation).isAfter(today, "day")) {
        this.loggerService.info(`${dateReservation} is after ${today}`);
        reservationIds.push(reservation.id);
      }
    }

    await this.reservationRepository.updateByQuery(
      {
        _where: [{ _field: "id", _op: "in", _val: reservationIds }],
      },
      {
        statusReservation: StatusReservation.Terminee,
        updatedAt: today as never,
      },
    );
  }

  // @Cron(CronExpression.EVERY_30_MINUTES)
  @Cron(CronExpression.EVERY_10_MINUTES)
  async reversementReservationClient() {
    this.loggerService.info("Refreshing reservation reversement");
    const reservations = await this.reservationRepository.findByQuery({
      _where: [
        {
          _field: "retraitProEffectue",
          _op: "eq",
          _val: false,
        },
        {
          _field: "statusFacture",
          _op: "eq",
          _val: StatusFacture.Paye,
        },
      ],
    });

    const today = moment();
    console.log("reservations.data: ", reservations.data.length);
    let reservation: Reservation = null;

    for (reservation of reservations.data) {
      console.log("reservation : ", reservation.id);

      const dateReversementBlock = moment(reservation.dateDebut).add(1, "days");
      const deblockReservationAmount = moment(reservation.dateFin).add(
        1,
        "days",
      );

      if (reservation.id == "bc0cd72e-dddf-439b-b071-5a088feee947") {
        console.log("reservation trouvé : ", reservation);
      }

      try {
        // Reverser les fonds au proprietaire si la date de debut de la reservation est depassee
        if (dateReversementBlock && dateReversementBlock.isBefore(today)) {
          if (reservation.proReverse != true) {
            // Crediter le proprietaire
            console.log("Start credit for ID: ", reservation.id);
            await this.reservationWalletCredit(reservation.id);
            // Marquer comme traité
            await this.reservationRepository.updateOne(reservation.id, {
              proReverse: true,
            });
          } else {
            // Verifier si la date de fin de la reservation est depassee pour debloquer les fonds
            if (
              deblockReservationAmount &&
              deblockReservationAmount.isBefore(today)
            ) {
              // Debloquer les fonds
              console.log("Start unblock for ID: ", reservation.id);
              await this.reservationWalletUnblock(reservation.id);
              // Marquer comme complètement traité
              await this.reservationRepository.updateOne(reservation.id, {
                retraitProEffectue: true,
              });
            }
          }
        }
      } catch (error) {
        this.loggerService.error("Catech error: ", error);
      }
    }
  }

  private async reservationWalletCredit(
    reservationId: string,
    operator?: PaymentMethod,
  ) {
    try {
      console.log("Reversement pour reservation : ", reservationId);
      const reservation: Reservation =
        await this.reservationRepository.findOne(reservationId);
      if (reservation) {
        console.log("Reservation recuperée : ", reservation.id);
        // Si le montant paye est superieur au 90% du montant total de la reservation
        const residenceId =
          typeof reservation.residence == "string"
            ? reservation.residence
            : reservation.residence.id;
        const residence: Residence =
          await this.residenceRepository.findOne(residenceId);

        if (residence) {
          const refundDate = new Date(reservation.dateDebut); // Date de debut de la reservation
          refundDate.setDate(refundDate.getDate() + 1); // Ajouter 1 jour a la date

          // Calcul montant à reverser
          const amountToRefund =
            reservation.montantTotalReservation - reservation.montantCommission;
          if (amountToRefund <= 0) return;
          // Crediter le proprietaire
          const note = "Crédit bloqué en attente de validation";
          const proprietaireWallet = await this.walletService.creditWallet(
            residence.proprietaire,
            amountToRefund,
            DEFAULT_CURRENCY,
            TransactionSource.RESERVATION,
            reservation.id,
            operator,
            note,
            refundDate,
          );
          if (proprietaireWallet) {
            // TODO : Envoyer une notification au proprietaire pour lui indiquer que son solde a bien ete crediter
            await this.notificationService.sendNotification({
              userId: residence.proprietaire as string,
              subject: this.globalizationService.t(
                "all.notifications.wallets.paiement_block_valide_pro.subject",
              ),
              message: this.globalizationService.t(
                "all.notifications.wallets.paiement_block_valide_pro.message",
              ),
              skipInAppNotification: false,
              sendMail: true,
              sendSms: true,
              returnUrl: ``,
              data: {
                type: PushNotificationType.Wallet,
                id: proprietaireWallet.id,
                wallet: PushNotificationType.Wallet,
                walletId: proprietaireWallet.id,
              },
            });
          }
        }
      }
    } catch (error) {
      this.loggerService.error("Reversement Catech error: ", error);
    }
  }

  private async reservationWalletUnblock(reservationId: string) {
    const reservation: Reservation =
      await this.reservationRepository.findOne(reservationId);

    if (reservation) {
      // Si le montant paye est superieur au 90% du montant total de la reservation
      const residenceId =
        typeof reservation.residence == "string"
          ? reservation.residence
          : reservation.residence.id;
      const residence: Residence =
        await this.residenceRepository.findOne(residenceId);

      if (residence) {
        const refundDate = new Date(reservation.dateDebut); // Date de debut de la reservation
        refundDate.setDate(refundDate.getDate() + 1); // Ajouter 1 jour a la date

        // Calcul montant à reverser
        const amountToRefund =
          reservation.montantTotalReservation - reservation.montantCommission;
        if (amountToRefund <= 0) return;
        // Crediter le proprietaire
        const note = "Deblocage de fonds bloqués";
        const proprietaireWallet = await this.walletService.releaseFunds(
          residence.proprietaire,
          amountToRefund,
          DEFAULT_CURRENCY,
          TransactionSource.RESERVATION,
          reservation.id,
          note,
        );

        if (proprietaireWallet) {
          // TODO : Envoyer une notification au proprietaire pour lui indiquer que son solde a bien été debloqué
          await this.notificationService.sendNotification({
            userId: residence.proprietaire as string,
            subject: this.globalizationService.t(
              "all.notifications.wallets.paiement_unblock_valide_pro.subject",
            ),
            message: this.globalizationService.t(
              "all.notifications.wallets.paiement_unblock_valide_pro.message",
            ),
            skipInAppNotification: false,
            sendMail: true,
            sendSms: true,
            returnUrl: ``,
            data: {
              type: PushNotificationType.Wallet,
              id: proprietaireWallet.id,
              wallet: PushNotificationType.Wallet,
              walletId: proprietaireWallet.id,
            },
          });
        }
      }
    }
  }
}
