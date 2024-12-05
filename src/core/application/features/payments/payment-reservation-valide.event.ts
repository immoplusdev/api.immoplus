import { OmitMethods } from "@/lib/ts-utilities";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { INotificationService } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";
import {
  PaymentDemandeVisiteValideEvent,
} from "@/core/application/features/payments/payment-demande-visite-valide.event";
import { IReservationRepository } from "@/core/domain/reservations";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { Residence } from "@/core/domain/residences";

export class PaymentReservationValideEvent {
  reservationId: string;

  constructor(data?: OmitMethods<PaymentReservationValideEvent>) {
    if (data) Object.assign(this, data);
  }
}

@EventsHandler(PaymentReservationValideEvent)
export class PaymentReservationValideEventHandler implements IEventHandler<PaymentReservationValideEvent> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.NotificationService) private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService) private readonly globalizationService: IGlobalizationService,
  ) {

  }

  async handle(event: PaymentReservationValideEvent) {
    const reservation = await this.reservationRepository.findOne(event.reservationId);
    if (!reservation) throw new ItemNotFoundException();

    await this.notificationService.sendNotification({
      userId: reservation.createdBy as string,
      subject: this.globalizationService.t("all.notifications.reservations.paiement_valide_client.subject"),
      message: this.globalizationService.t("all.notifications.reservations.paiement_valide_client.message"),
      returnUrl: `${HUB2_RETURN_URL}/payment/reservations/${reservation.id}`,
    });

    await this.notificationService.sendNotification({
      userId: (reservation.residence as Residence).proprietaire,
      subject: this.globalizationService.t("all.notifications.reservations.paiement_valide_pro.subject"),
      message: this.globalizationService.t("all.notifications.reservations.paiement_valide_pro.message"),
      returnUrl: `${HUB2_RETURN_URL}/payment/reservations/${reservation.id}`,
    });
  }
}
