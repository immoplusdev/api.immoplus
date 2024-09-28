import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { EstimerPrixDemandeVisiteQueryResponse } from "./estimer-prix-demande-visite-query.response";
import { EstimerPrixDemandeVisiteQuery } from "./estimer-prix-demande-visite.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { ItemNotFoundException, UnexpectedException } from "@/core/domain/shared/exceptions";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";

@QueryHandler(EstimerPrixDemandeVisiteQuery)
export class EstimerPrixDemandeVisiteQueryHandler
  implements IQueryHandler<EstimerPrixDemandeVisiteQuery, EstimerPrixDemandeVisiteQueryResponse> {
  constructor(
    @Inject(Deps.BiensImmobiliesRepository) private readonly bienImmobilierRepository: IBienImmobilierRepository,
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
  ) {
    //
  }

  async execute(query: EstimerPrixDemandeVisiteQuery): Promise<EstimerPrixDemandeVisiteQueryResponse> {

    const bienImmobilier = await this.bienImmobilierRepository.findOne(query.bienImmobilier);
    if (!bienImmobilier) throw new ItemNotFoundException();

    const configs = await this.configsManagerService.getAppConfigs();

    const prixDemandeVisite = query.typeDemandeVisite == TypeDemandeVisite.Express ? configs.expressVisitPrice : configs.normalVisitPrice;

    if (prixDemandeVisite == 0) throw new UnexpectedException();

    return new EstimerPrixDemandeVisiteQueryResponse({
      bienImmobilier: query.bienImmobilier,
      // datesDemandeVisite: query.datesDemandeVisite,
      montantDemandeVisiteSansCommission: prixDemandeVisite,
      montantTotalDemandeVisite: prixDemandeVisite,
    });
  }
}