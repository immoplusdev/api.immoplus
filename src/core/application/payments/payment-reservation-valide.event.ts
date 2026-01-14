import { OmitMethods } from "@/lib/ts-utilities";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import {
  INotificationService,
  PushNotificationType,
} from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";
import { IReservationRepository } from "@/core/domain/reservations";
import { IResidenceRepository } from "@/core/domain/residences";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";
import { IUserRepository } from "@/core/domain/users";

export class PaymentReservationValideEvent {
  reservationId: string;

  constructor(data?: OmitMethods<PaymentReservationValideEvent>) {
    if (data) Object.assign(this, data);
  }
}

@EventsHandler(PaymentReservationValideEvent)
export class PaymentReservationValideEventHandler implements IEventHandler<PaymentReservationValideEvent> {
  constructor(
    @Inject(Deps.ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
  ) {}

  async handle(event: PaymentReservationValideEvent) {
    const reservation = await this.reservationRepository.findOne(
      event.reservationId,
    );

    if (!reservation) throw new ItemNotFoundException();

    const residence = await this.residenceRepository.findOne(
      getIdFromObject(reservation.residence),
    );
    if (!residence) throw new ItemNotFoundException();

    const client = await this.usersRepository.findPublicUserInfoByUserId(
      reservation.createdBy,
    );
    const proprietaire = await this.usersRepository.findPublicUserInfoByUserId(
      residence.proprietaire,
    );

    await this.notificationService.sendNotification({
      userId: client.id,
      subject: this.globalizationService.t(
        "all.notifications.reservations.paiement_valide_client.subject",
      ),
      message: this.globalizationService.t(
        "all.notifications.reservations.paiement_valide_client.message",
      ),
      skipInAppNotification: false,
      sendMail: true,
      sendSms: true,
      returnUrl: `${HUB2_RETURN_URL}/payment/reservations/${reservation.id}`,
      data: {
        type: PushNotificationType.Reservation,
        id: reservation.id,
      },
    });

    await this.notificationService.sendNotification({
      userId: proprietaire.id,
      subject: this.globalizationService.t(
        "all.notifications.reservations.paiement_valide_pro.subject",
      ),
      message: this.globalizationService.t(
        "all.notifications.reservations.paiement_valide_pro.message",
      ),
      skipInAppNotification: false,
      sendMail: true,
      sendSms: true,
      returnUrl: `${HUB2_RETURN_URL}/payment/reservations/${reservation.id}`,
      data: {
        type: PushNotificationType.Reservation,
        id: reservation.id,
      },
    });
  }
}
