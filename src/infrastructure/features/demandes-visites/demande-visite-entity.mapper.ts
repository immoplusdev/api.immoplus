import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { DemandeVisiteEntity } from "./demande-visite.entity";


export class DemandeVisiteEntityMapper implements IMapper<DemandeVisiteEntity, DemandeVisite> {
  mapFrom(object: OmitMethods<DemandeVisiteEntity>): DemandeVisite {
    return new DemandeVisite(object);
  }

  mapTo(object: OmitMethods<DemandeVisite>): DemandeVisiteEntity {
    return new DemandeVisiteEntity(object);
  }
}
