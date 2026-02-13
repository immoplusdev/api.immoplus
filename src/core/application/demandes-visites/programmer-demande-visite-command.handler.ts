import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { ProgrammerDemandeVisiteCommand } from "./programmer-demande-visite.command";
import { ProgrammerDemandeVisiteCommandResponse } from "./programmer-demande-visite-command.response";
import { GetDemandeVisiteByIdQuery } from "@/core/application/demandes-visites/get-demande-visite-by-id.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import {
  INotificationService,
  PushNotificationType,
  IEmailTemplateService,
  EmailTemplate,
  IMailService,
} from "@/core/domain/notifications";
import { IUserRepository } from "@/core/domain/users";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { IGlobalizationService } from "@/core/domain/globalization";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

@CommandHandler(ProgrammerDemandeVisiteCommand)
export class ProgrammerDemandeVisiteCommandHandler implements ICommandHandler<ProgrammerDemandeVisiteCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.EmailTemplateService)
    private readonly emailTemplateService: IEmailTemplateService,
    @Inject(Deps.MailService)
    private readonly mailService: IMailService,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.BiensImmobiliesRepository)
    private readonly bienImmobilierRepository: IBienImmobilierRepository,
  ) {
    //
  }

  async execute(
    command: ProgrammerDemandeVisiteCommand,
  ): Promise<ProgrammerDemandeVisiteCommandResponse> {
    const demandeVisite = await this.demandeVisiteRepository.findOne(
      command.id,
    );
    if (!demandeVisite) throw new ItemNotFoundException();

    // Update
    await this.demandeVisiteRepository.updateOne(command.id, {
      datesDemandeVisite: command.datesDemandeVisite,
    });

    // Get client info
    const client = await this.usersRepository.findOne(
      getIdFromObject(demandeVisite.createdBy),
    );

    // Get bien immobilier info
    const bienId =
      typeof demandeVisite.bienImmobilier === "string"
        ? demandeVisite.bienImmobilier
        : demandeVisite.bienImmobilier?.id;
    const bienImmobilier = bienId
      ? await this.bienImmobilierRepository.findOne(bienId)
      : null;

    // Format date (ServiceDates is an array of ServiceDate)
    const firstDate = command.datesDemandeVisite?.[0]?.date;
    const dateVisite = firstDate
      ? new Date(firstDate).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Date à confirmer";

    const subject = this.globalizationService.t(
      "all.notifications.demandes_visites.visite_programmee_client.subject",
    );
    const message = this.globalizationService.t(
      "all.notifications.demandes_visites.visite_programmee_client.message",
    );

    // Send HTML email if client exists
    if (client?.email) {
      const html = await this.emailTemplateService.render(
        EmailTemplate.VISITE_CONFIRMEE,
        {
          prenom: client.firstName || "Client",
          residence_name: bienImmobilier?.nom || "Bien immobilier",
          date_heure: dateVisite,
          adresse_residence:
            bienImmobilier?.adresse ||
            `${bienImmobilier?.commune || ""}, ${bienImmobilier?.ville || ""}`.trim() ||
            "Adresse à confirmer",
          lien: `${HUB2_RETURN_URL}/payment/demandes-visites/${command.id}`,
          unsubscribe_link: "https://immoplus.ci/unsubscribe",
        },
      );

      await this.mailService.sendMail({
        to: "dev.johnlight@gmail.com",
        subject,
        html,
      });
    }

    // Send push notification and SMS (without email since we already sent it)
    await this.notificationService.sendNotification({
      userId: getIdFromObject(demandeVisite.createdBy),
      subject,
      message,
      returnUrl: `${HUB2_RETURN_URL}/payment/demandes-visites/${command.id}`,
      sendMail: false,
      sendSms: true,
      skipInAppNotification: false,
      data: {
        type: PushNotificationType.DemandeVisite,
        id: demandeVisite.id,
      },
    });

    return await this.queryBus.execute(
      new GetDemandeVisiteByIdQuery({ id: command.id }),
    );
  }
}
