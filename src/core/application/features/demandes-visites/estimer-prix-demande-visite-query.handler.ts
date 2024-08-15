import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { EstimerPrixDemandeVisiteQueryResponse } from "./estimer-prix-demande-visite-query.response";
import { EstimerPrixDemandeVisiteQuery } from "./estimer-prix-demande-visite.query";

@QueryHandler(EstimerPrixDemandeVisiteQuery)
export class EstimerPrixDemandeVisiteQueryHandler
  implements IQueryHandler<EstimerPrixDemandeVisiteQuery, EstimerPrixDemandeVisiteQueryResponse>
{
  constructor() {
    //
  }
  async execute(query: EstimerPrixDemandeVisiteQuery): Promise<EstimerPrixDemandeVisiteQueryResponse> {
    return new EstimerPrixDemandeVisiteQueryResponse();
  }
}