import { Residence } from "@/core/domain/residences";
import { ResidenceDto } from "./residence.dto";
import { IMapper } from "@/lib/ts-utilities";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class ResidenceDtoMapper implements IMapper<Residence, ResidenceDto> {
  mapFrom(object: Residence): ResidenceDto {
    const ville_id =
      typeof object.ville === "string"
        ? object.ville
        : getIdFromObject(object.ville);

    const commune_id =
      typeof object.commune === "string"
        ? object.commune
        : getIdFromObject(object.commune);

    return new ResidenceDto({
      ...object,
      ville_id,
      commune_id,
      ville: object.ville,
      commune: object.commune,
    });
  }

  mapTo(object: ResidenceDto): Residence {
    return new Residence(object);
  }
}
