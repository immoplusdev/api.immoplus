import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { DemandeVisiteEntity } from "./demande-visite.entity";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";

export class DemandeVisiteEntityMapper
  implements IMapper<DemandeVisiteEntity, DemandeVisite>
{
  mapFrom(param: OmitMethods<DemandeVisiteEntity>): DemandeVisite {
    return new DemandeVisite({
      ...param,
      bienImmobilier: param.bienImmobilier as BienImmobilier,
    });
  }

  mapTo(param: OmitMethods<DemandeVisite>): DemandeVisiteEntity {
    return new DemandeVisiteEntity(param);
  }
}
