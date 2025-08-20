import { OmitMethods } from "@/lib/ts-utilities";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { INotificationService } from "@/core/domain/notifications";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { IGlobalizationService } from "@/core/domain/globalization";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";

export class PaymentDemandeVisiteValideEvent {
  demandeVisiteId: string;

  constructor(data?: OmitMethods<PaymentDemandeVisiteValideEvent>) {
    if (data) Object.assign(this, data);
  }
}

@EventsHandler(PaymentDemandeVisiteValideEvent)
export class PaymentDemandeVisiteValideEventHandler
  implements IEventHandler<PaymentDemandeVisiteValideEvent>
{
  constructor(
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
  ) {}

  async handle(event: PaymentDemandeVisiteValideEvent) {
    const demandeVisite = await this.demandeVisiteRepository.findOne(
      event.demandeVisiteId,
    );
    if (!demandeVisite) throw new ItemNotFoundException();

    await this.notificationService.sendNotification({
      userId: demandeVisite.createdBy as string,
      subject: this.globalizationService.t(
        "all.notifications.demandes_visites.paiement_valide_client.subject",
      ),
      message: this.globalizationService.t(
        "all.notifications.demandes_visites.paiement_valide_client.message",
      ),
      returnUrl: `${HUB2_RETURN_URL}/payment/demandes-visites/${demandeVisite.id}`,
      skipInAppNotification: false,
      sendMail: true,
      sendSms: true,
    });

    await this.notificationService.sendNotification({
      userId: (demandeVisite.bienImmobilier as BienImmobilier)
        .proprietaire as string,
      subject: this.globalizationService.t(
        "all.notifications.demandes_visites.paiement_valide_pro.subject",
      ),
      message: this.globalizationService.t(
        "all.notifications.demandes_visites.paiement_valide_pro.message",
      ),
      returnUrl: `${HUB2_RETURN_URL}/payment/demandes-visites/${demandeVisite.id}`,
      skipInAppNotification: false,
      sendMail: true,
      sendSms: true,
    });
  }
}
