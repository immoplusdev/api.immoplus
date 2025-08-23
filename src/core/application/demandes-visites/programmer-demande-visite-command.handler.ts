import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { ProgrammerDemandeVisiteCommand } from "./programmer-demande-visite.command";
import { ProgrammerDemandeVisiteCommandResponse } from "./programmer-demande-visite-command.response";
import { GetDemandeVisiteByIdQuery } from "@/core/application/demandes-visites/get-demande-visite-by-id.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { INotificationService } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { HUB2_RETURN_URL } from "@/infrastructure/configs/payments";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";

@CommandHandler(ProgrammerDemandeVisiteCommand)
export class ProgrammerDemandeVisiteCommandHandler
  implements ICommandHandler<ProgrammerDemandeVisiteCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
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

    await this.demandeVisiteRepository.updateOne(command.id, {
      datesDemandeVisite: command.datesDemandeVisite,
    });

    await this.notificationService.sendNotification({
      userId: demandeVisite.createdBy as string,
      subject: this.globalizationService.t(
        "all.notifications.demandes_visites.visite_programmee_client.subject",
      ),
      message: this.globalizationService.t(
        "all.notifications.demandes_visites.visite_programmee_client.message",
      ),
      returnUrl: `${HUB2_RETURN_URL}/payment/demandes-visites/${command.id}`,
      sendMail: true,
      sendSms: true,
      skipInAppNotification: false,
    });

    return await this.queryBus.execute(
      new GetDemandeVisiteByIdQuery({ id: command.id }),
    );
  }
}
