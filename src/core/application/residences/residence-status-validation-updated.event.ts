import { castObject, OmitMethods } from "@/lib/ts-utilities";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";
import { IResidenceRepository } from "@/core/domain/residences";
import { INotificationService } from "@/core/domain/notifications";
import { User } from "@/core/domain/users";

export class ResidenceStatusValidationUpdatedEvent {
  id: string;
  status: StatusValidationBienImmobilier;

  constructor(data?: OmitMethods<ResidenceStatusValidationUpdatedEvent>) {
    if (data) Object.assign(this, data);
  }
}

@EventsHandler(ResidenceStatusValidationUpdatedEvent)
export class ResidenceStatusUpdatedEventHandler
  implements IEventHandler<ResidenceStatusValidationUpdatedEvent>
{
  constructor(
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
  ) {}

  async handle(event: ResidenceStatusValidationUpdatedEvent) {
    if (event.status != StatusValidationBienImmobilier.Valide) return;
    const residence = await this.residenceRepository.findOne(event.id, {
      relations: ["proprietaire"],
    });


    const proprietaire = castObject<User>(residence.proprietaire as never);

    const emailContent = `
    Objet : Votre résidence est validée sur ImmoPlus !

    Bonjour ${proprietaire.lastName} ${proprietaire.firstName} ,
    
    Félicitations ! Nous avons le plaisir de vous informer que votre résidence **[Nom de la résidence]** a été validée avec succès par notre équipe.
    
    Vous pouvez désormais accueillir des voyageurs et leur offrir un séjour unique dans votre propriété. Voici quelques conseils pour garantir leur satisfaction :  
    
    1. Accueillez-les chaleureusement dès leur arrivée.  
    2. Assurez-vous que la résidence est propre et prête à les recevoir.  
    3. Restez disponible en cas de besoin pour répondre à leurs questions.  
    
    Votre succès est notre priorité, et nous sommes ravis de vous accompagner dans cette aventure. Si vous avez la moindre question ou besoin d’assistance, n’hésitez pas à nous contacter.
    
    Cordialement,  
    L’équipe ImmoPlus  
    [Coordonnées de votre service]`;

    await this.notificationService.sendNotification({
      userId: proprietaire.id,
      subject: "🎉 Votre résidence est validée !",
      message: `🏡 Félicitations ! Votre résidence ${residence.nom} a été validée par ImmoPlus.\\n\\nVous pouvez désormais accueillir des voyageurs. Offrez-leur une expérience inoubliable et gagnez leur confiance ! 😊`,
      htmlMessage: emailContent,
      returnUrl: `${HUB2_RETURN_URL}/residence_detail/${residence.id}`,
      sendMail: true,
    });
  }
}
