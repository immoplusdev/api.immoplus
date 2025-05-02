import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetBienImmobilierOccupiedDatesQueryResponse } from "./get-bien-immobilier-occupied-dates-query.response";
import { GetBienImmobilierOccupiedDatesQuery } from "./get-bien-immobilier-occupied-dates.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";

@QueryHandler(GetBienImmobilierOccupiedDatesQuery)
export class GetBienImmobilierOccupiedDateQueryHandler
  implements IQueryHandler<GetBienImmobilierOccupiedDatesQuery, GetBienImmobilierOccupiedDatesQueryResponse>
{
  constructor(
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
  ) {
  }
  async execute(query: GetBienImmobilierOccupiedDatesQuery): Promise<GetBienImmobilierOccupiedDatesQueryResponse> {
    const reservations = await this.demandeVisiteRepository.findByQuery({
      _where: [
        {
          _field: "bienImmobilier",
          _val: query.bienImmobilierId,
        },
      ],
      _select: ["datesDemandeVisite"],
    }, { relations: [], loadRelationIds: true});

    const dates = reservations.data.map((demandeVisite) => demandeVisite.datesDemandeVisite).flat();

    return new GetBienImmobilierOccupiedDatesQueryResponse({ dates });
  }
}
