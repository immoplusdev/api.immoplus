import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetDemandeVisiteByIdQueryResponse } from "./get-demande-visite-by-id-query.response";
import { GetDemandeVisiteByIdQuery } from "./get-demande-visite-by-id.query";

@QueryHandler(GetDemandeVisiteByIdQuery)
export class GetDemandeVisiteByIdQueryHandler
  implements IQueryHandler<GetDemandeVisiteByIdQuery, GetDemandeVisiteByIdQueryResponse>
{
  constructor() {
    //
  }
  async execute(query: GetDemandeVisiteByIdQuery): Promise<GetDemandeVisiteByIdQueryResponse> {
    return new GetDemandeVisiteByIdQueryResponse();
  }
}