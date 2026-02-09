import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateDemandeVisiteCommand } from "./create-demande-visite.command";
import { CreateDemandeVisiteCommandResponse } from "./create-demande-visite-command.response";
import {
  ItemNotFoundException,
  ConflictException,
} from "@/core/domain/common/exceptions";
import { Inject } from "@nestjs/common";
import {
  IDemandeVisiteRepository,
  StatusDemandeVisite,
  TypeDemandeVisite,
} from "@/core/domain/demandes-visites";
import { Deps } from "@/core/domain/common/ioc";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { IUserRepository } from "@/core/domain/users";
import {
  EstimerPrixDemandeVisiteQuery,
  EstimerPrixDemandeVisiteQueryResponse,
  GetDemandeVisiteByIdQuery,
} from "@/core/application/demandes-visites";
import {
  INotificationService,
  PushNotificationType,
  IEmailTemplateService,
  EmailTemplate,
  IMailService,
} from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";

@CommandHandler(CreateDemandeVisiteCommand)
export class CreateDemandeVisiteCommandHandler implements ICommandHandler<CreateDemandeVisiteCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.BiensImmobiliesRepository)
    private readonly biensImmobiliesRepository: IBienImmobilierRepository,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.EmailTemplateService)
    private readonly emailTemplateService: IEmailTemplateService,
    @Inject(Deps.MailService)
    private readonly mailService: IMailService,
  ) {}

  async execute(
    command: CreateDemandeVisiteCommand,
  ): Promise<CreateDemandeVisiteCommandResponse> {
    const calculationResult: EstimerPrixDemandeVisiteQueryResponse =
      await this.queryBus.execute(
        new EstimerPrixDemandeVisiteQuery({ ...command }),
      );

    const bienImmobilier = await this.biensImmobiliesRepository.findOne(
      command.bienImmobilier,
      { fields: ["id", "proprietaire"] },
    );
    if (!bienImmobilier) throw new ItemNotFoundException();

    if (!command.clientPhoneNumber) {
      const client = await this.usersRepository.findOne(command.userId, {
        relations: [],
        fields: ["id", "phoneNumber"],
      });
      command.setClientPhoneNumber(client.phoneNumber);
    }

    const existingDemande = await this.demandeVisiteRepository.findOneByQuery(
      {
        _where: [
          {
            _field: "bienImmobilier.id",
            _op: "eq",
            _val: command.bienImmobilier,
          },
          {
            _field: "createdBy.id",
            _op: "eq",
            _val: command.userId,
          },
          {
            _field: "statusDemandeVisite",
            _op: "in",
            _val: [StatusDemandeVisite.Valide, StatusDemandeVisite.EnCours],
          },
        ],
      },
      { relations: [] },
    );

    if (existingDemande) {
      throw new ConflictException(
        "Vous avez déjà une demande de visite en attente sur cette résidence",
      );
    }

    const { id } = await this.demandeVisiteRepository.createOne(
      {
        bienImmobilier: command.bienImmobilier,
        typeDemandeVisite: command.typeDemandeVisite,
        datesDemandeVisite: [],
        notes: command.notes || null,
        montantTotalDemandeVisite: calculationResult.montantTotalDemandeVisite,
        montantCommission: calculationResult.montantCommission,
        clientPhoneNumber: command.clientPhoneNumber,
        createdBy: command.userId,
      },
      false,
    );

    if (command.typeDemandeVisite === TypeDemandeVisite.Normal) {
      console.log(
        "bienImmobilier.proprietaire as string: ",
        bienImmobilier.proprietaire as string,
      );

      const subject = this.globalizationService.t(
        "all.notifications.demandes_visites.nouvelle_demande_visite_normale_pro.subject",
      );
      const message = this.globalizationService.t(
        "all.notifications.demandes_visites.nouvelle_demande_visite_normale_pro.message",
      );

      // Get owner info
      const owner = await this.usersRepository.findOne(
        bienImmobilier.proprietaire as string,
      );

      // Get client info
      const client = await this.usersRepository.findOne(command.userId);

      // Get full bien info for residence name and address
      const bienFull = await this.biensImmobiliesRepository.findOne(
        command.bienImmobilier,
      );

      // Send HTML email if owner exists
      if (owner?.email) {
        const html = await this.emailTemplateService.render(
          EmailTemplate.NOUVELLE_DEMANDE_VISITE,
          {
            nom_proprietaire:
              `${owner.firstName || ""} ${owner.lastName || ""}`.trim() ||
              "Propriétaire",
            residence_name: bienFull?.nom || "Bien immobilier",
            adresse_residence:
              bienFull?.adresse ||
              `${bienFull?.commune || ""}, ${bienFull?.ville || ""}`.trim() ||
              "Adresse non spécifiée",
            nom_client:
              `${client?.firstName || ""} ${client?.lastName || ""}`.trim() ||
              "Client",
            date_propose: "À définir",
            lien: `https://immoplus.ci`,
            unsubscribe_link: "https://immoplus.ci/unsubscribe",
          },
        );

        await this.mailService.sendMail({
          to: owner.email,
          subject,
          html,
        });
      }

      // Send push notification and SMS (without email since we already sent it)
      await this.notificationService.sendNotification({
        userId: bienImmobilier.proprietaire as string,
        subject,
        message,
        sendMail: false,
        sendSms: true,
        skipInAppNotification: false,
        data: {
          type: PushNotificationType.DemandeVisite,
          id,
        },
      });
    }

    return await this.queryBus.execute(new GetDemandeVisiteByIdQuery({ id }));
  }
}
