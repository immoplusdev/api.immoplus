import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetDemandeVisiteByIdQueryResponse } from "./get-demande-visite-by-id-query.response";
import { GetDemandeVisiteByIdQuery } from "./get-demande-visite-by-id.query";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";
import { Inject } from "@nestjs/common";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import { Deps } from "@/core/domain/shared/ioc";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import { IUserRepository } from "@/core/domain/users";

@QueryHandler(GetDemandeVisiteByIdQuery)
export class GetDemandeVisiteByIdQueryHandler
  implements IQueryHandler<GetDemandeVisiteByIdQuery, GetDemandeVisiteByIdQueryResponse>
{
  constructor(
    @Inject(Deps.DemandeVisiteRepository)
    private readonly demandeVisiteRepository: IDemandeVisiteRepository,
    @Inject(Deps.BiensImmobiliesRepository)
     private readonly bienImmobilierRepository: IBienImmobilierRepository,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUserRepository,
    ) {
    //
  }
  async execute(query: GetDemandeVisiteByIdQuery): Promise<GetDemandeVisiteByIdQueryResponse> {
    const demandeVisite = await this.demandeVisiteRepository.findOne(query.id);
    if (!demandeVisite) throw new ItemNotFoundException();

    const bienImmobilier = await this.bienImmobilierRepository.findOne(demandeVisite.bienImmobilier as string, {fields: ["id", "proprietaire"]});
    if (!bienImmobilier) throw new ItemNotFoundException();

    const client = await this.usersRepository.findPublicUserInfoByUserId(bienImmobilier.createdBy);
    const proprietaire = await this.usersRepository.findPublicUserInfoByUserId(bienImmobilier.proprietaire);

    return new GetDemandeVisiteByIdQueryResponse({
      ...demandeVisite,
      bienImmobilier,
      client,
      proprietaire,
    });
  }
}