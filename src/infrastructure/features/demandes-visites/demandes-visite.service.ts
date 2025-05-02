import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Deps } from "@/core/domain/common/ioc";
import { ILoggerService } from "@/core/domain/logging";
import * as moment from "moment";
import { StatusFacture } from "@/core/domain/payments";
import { IDemandeVisiteRepository, StatusDemandeVisite } from "@/core/domain/demandes-visites";

@Injectable()
export class DemandesVisiteService {
  constructor(
    @Inject(Deps.LoggerService)
    private readonly loggerService: ILoggerService,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
  ) {
  }


  @Cron(CronExpression.EVERY_30_MINUTES)
  // @Cron("0 */12 * * *")
  async refreshDemandeVisiteStatus() {
    this.loggerService.info("Refreshing demande visite status");
    const demandesVisite = await this.demandeVisiteRepository.findByQuery({
      _where: [
        { _field: "statusDemandeVisite", _op: "neq", _val: StatusDemandeVisite.Terminee },
        { _field: "statusFacture", _op: "eq", _val: StatusFacture.Paye },
      ],
    });

    const demandesVisiteIds = [];
    const today = moment().format("YYYY-MM-DD");

    for (const demandeVisite of demandesVisite.data) {
      const dateDemandeVisite = demandeVisite.datesDemandeVisite
        .sort((item1, item2) => moment(item1.date).diff(moment(item2.date)))
        .map(item => item.date)[0];

      if (dateDemandeVisite && moment(dateDemandeVisite).isAfter(today, "day")) {
        this.loggerService.info(`${dateDemandeVisite} is after ${today}`);
        demandesVisiteIds.push(demandeVisite.id);
      }
    }

    await this.demandeVisiteRepository.updateByQuery({
      _where: [{ _field: "id", _op: "in", _val: demandesVisiteIds }],
    }, { statusDemandeVisite: StatusDemandeVisite.Terminee, updatedAt: today as never });
  }
}
