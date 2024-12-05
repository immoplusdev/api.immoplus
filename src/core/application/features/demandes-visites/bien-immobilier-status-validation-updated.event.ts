import { IBienImmobilierRepository, StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { castObject, OmitMethods } from "@/lib/ts-utilities";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { INotificationService } from "@/core/domain/notifications";
import { User } from "@/core/domain/users";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";


export class BienImmobilierStatusValidationUpdatedEvent {
  id: string;
  status: StatusValidationBienImmobilier;

  constructor(data?: OmitMethods<BienImmobilierStatusValidationUpdatedEvent>) {
    if (data) Object.assign(this, data);
  }
}


@EventsHandler(BienImmobilierStatusValidationUpdatedEvent)
export class BienImmobilierStatusValidationUpdatedEventHandler implements IEventHandler<BienImmobilierStatusValidationUpdatedEvent> {
  constructor(
    @Inject(Deps.BiensImmobiliesRepository) private readonly bienImmobilier: IBienImmobilierRepository,
    @Inject(Deps.NotificationService) private readonly notificationService: INotificationService,
  ) {
  }

  async handle(event: BienImmobilierStatusValidationUpdatedEvent) {
    if (event.status != StatusValidationBienImmobilier.Valide) return;
    const bienImmobilier = await this.bienImmobilier.findOne(event.id, {
      relations: ["proprietaire"],
    });
    const proprietaire = castObject<User>(bienImmobilier.proprietaire as never);

    const emailContent = `
    Objet : Votre bien immobilier est validé par ImmoPlus !

    Bonjour ${proprietaire.lastName} ${proprietaire.firstName},

    Félicitations ! Nous avons le plaisir de vous informer que votre bien immobilier **[Appartement/Terrain : Nom du bien]** a été validé avec succès par notre équipe.
    
    Vous pouvez désormais recevoir des demandes de visite pour ce bien. Voici quelques conseils pour optimiser vos interactions avec les visiteurs :  
    
    1. Soyez ponctuel et organisé : Accueillez les visiteurs à l’heure convenue pour leur offrir une expérience agréable.  
    2. Mettez en valeur votre bien : Assurez-vous qu’il est propre, bien présenté et prêt à être visité.  
    3. Répondez à leurs questions : Fournissez des informations claires et précises pour les aider dans leur décision.  
    
    Nous sommes convaincus que votre expertise et votre engagement contribueront à une expérience positive pour vos visiteurs. Si vous avez des questions ou besoin d’assistance, notre équipe est là pour vous accompagner.
    
    Cordialement,  
    L’équipe ImmoPlus  
    [Coordonnées de votre service]
    `;

    await this.notificationService.sendNotification({
      userId: proprietaire.id,
      subject: "🎉 Votre bien est validé par ImmoPlus !",
      message: `🏡 Félicitations ! Votre bien ([Appartement/Terrain] : ${bienImmobilier.nom}) est validé.\n\nVous pouvez désormais recevoir des demandes de visite. Offrez aux visiteurs un accueil chaleureux et professionnel pour maximiser vos opportunités ! 😊`,
      htmlMessage: emailContent,
      returnUrl: `${HUB2_RETURN_URL}/estate_detail/${bienImmobilier.id}`,
      sendMail: true,
    });
  }
}
