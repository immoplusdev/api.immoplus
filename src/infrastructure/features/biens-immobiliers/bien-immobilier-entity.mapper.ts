import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierEntity } from "./bien-immobilier.entity";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class BienImmobilierEntityMapper implements IMapper<
  BienImmobilierEntity,
  BienImmobilier
> {
  mapFrom(object: OmitMethods<BienImmobilierEntity>): BienImmobilier {
    return new BienImmobilier({
      ...object,
      miniature: getIdFromObject(object.miniature),
      video: getIdFromObject(object.video),
      ville: getIdFromObject(object.ville),
      commune: getIdFromObject(object.commune),
      ville_model: typeof object.ville === "object" ? object.ville : undefined,
      commune_model:
        typeof object.commune === "object" ? object.commune : undefined,
      proprietaire: getIdFromObject(object.proprietaire),
    });
  }

  mapTo(object: OmitMethods<BienImmobilier>): BienImmobilierEntity {
    return new BienImmobilierEntity({
      ...object,
      ville: getIdFromObject(object.ville),
      commune: getIdFromObject(object.commune),
    });
  }
}
