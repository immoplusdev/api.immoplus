import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierDto } from "./bien-immobilier.dto";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class BienImmobilierDtoMapper
  implements IMapper<BienImmobilier, BienImmobilierDto>
{
  mapFrom(object: OmitMethods<BienImmobilier>): BienImmobilierDto {
    const proprietaire =
      typeof object.proprietaire == "string"
        ? object.proprietaire
        : getIdFromObject(object.proprietaire);
    return new BienImmobilierDto({
      ...object,
      proprietaire,
    });
  }

  mapTo(object: OmitMethods<BienImmobilierDto>): BienImmobilier {
    return new BienImmobilier(object);
  }
}
