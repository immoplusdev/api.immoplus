import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { DemandeVisiteEntity } from "./demande-visite.entity";


export class DemandeVisiteEntityMapper implements IMapper<DemandeVisiteEntity, DemandeVisite> {
  mapFrom(param: OmitMethods<DemandeVisiteEntity>): DemandeVisite {
    const object = new DemandeVisite(param);
    if (param.bienImmobilier && typeof param.bienImmobilier === "object") {
      object.bienImmobilierId = param.bienImmobilier.id;
    }

    return object;
  }

  mapTo(param: OmitMethods<DemandeVisite>): DemandeVisiteEntity {
    return new DemandeVisiteEntity(param);
  }
}
