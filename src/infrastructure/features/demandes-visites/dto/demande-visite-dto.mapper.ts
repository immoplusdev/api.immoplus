import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { DemandeVisiteDto } from "./demande-visite.dto";


export class DemandeVisiteDtoMapper implements IMapper<DemandeVisite, DemandeVisiteDto> {
  mapFrom(object: OmitMethods<DemandeVisite>): DemandeVisiteDto {
    return new DemandeVisiteDto({ ...object, bienImmobilier: object.bienImmobilier as string });
  }

  mapTo(object: OmitMethods<DemandeVisiteDto>): DemandeVisite {
    return new DemandeVisite(object);
  }
}
