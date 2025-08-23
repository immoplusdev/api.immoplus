import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { DemandeVisiteDto } from "./demande-visite.dto";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";

export class DemandeVisiteDtoMapper
  implements IMapper<DemandeVisite, DemandeVisiteDto>
{
  mapFrom(object: OmitMethods<DemandeVisite>): DemandeVisiteDto {
    return new DemandeVisiteDto({
      ...object,
      bienImmobilier: object.bienImmobilier as BienImmobilier,
    });
  }

  mapTo(object: OmitMethods<DemandeVisiteDto>): DemandeVisite {
    return new DemandeVisite(object);
  }
}
