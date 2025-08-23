import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { EstimerPrixReservationQueryResponse } from "./estimer-prix-reservation-query.response";
import { EstimerPrixReservationQuery } from "./estimer-prix-reservation.query";
import { Inject } from "@nestjs/common";
import { IResidenceRepository } from "@/core/domain/residences";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { UnexpectedException } from "@/core/domain/common/exceptions";

@QueryHandler(EstimerPrixReservationQuery)
export class EstimerPrixReservationQueryHandler
  implements
    IQueryHandler<
      EstimerPrixReservationQuery,
      EstimerPrixReservationQueryResponse
    >
{
  constructor(
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {
    //
  }

  async execute(
    query: EstimerPrixReservationQuery,
  ): Promise<EstimerPrixReservationQueryResponse> {
    const residence = await this.residenceRepository.findOne(query.residence);
    const configs = await this.configsManagerService.getAppConfigs();

    const pourcentageCommissionReservation =
      configs.pourcentageCommissionReservation;
    const montantTotalReservation =
      residence.prixReservation * query.datesReservation.length;

    if (montantTotalReservation == 0) throw new UnexpectedException();
    const montantCommission = this.formatAmount(
      (montantTotalReservation * pourcentageCommissionReservation) / 100,
    );

    return new EstimerPrixReservationQueryResponse({
      residence: query.residence,
      datesReservation: query.datesReservation,
      montantTotalReservation,
      montantCommission,
    });
  }

  formatAmount(montant: number): number {
    return Math.ceil(montant / 5) * 5;
  }
}
