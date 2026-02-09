import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierDto } from "./bien-immobilier.dto";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class BienImmobilierDtoMapper implements IMapper<
  BienImmobilier,
  BienImmobilierDto
> {
  mapFrom(object: OmitMethods<BienImmobilier>): BienImmobilierDto {
    const proprietaire =
      typeof object.proprietaire == "string"
        ? object.proprietaire
        : getIdFromObject(object.proprietaire);

    const ville_id =
      typeof object.ville === "string"
        ? object.ville
        : getIdFromObject(object.ville);

    const commune_id =
      typeof object.commune === "string"
        ? object.commune
        : getIdFromObject(object.commune);

    return new BienImmobilierDto({
      ...object,
      proprietaire,
      ville_id,
      commune_id,
      ville: ville_id,
      commune: commune_id,
      ville_model: object.ville_model,
      commune_model: object.commune_model,
    });
  }

  mapTo(object: OmitMethods<BienImmobilierDto>): BienImmobilier {
    return new BienImmobilier(object);
  }
}
