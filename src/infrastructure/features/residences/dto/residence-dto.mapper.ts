import { Residence } from "@/core/domain/residences";
import { ResidenceDto } from "./residence.dto";
import { IMapper } from "@/lib/ts-utilities";

export class ResidenceDtoMapper implements IMapper<Residence, ResidenceDto> {
  mapFrom(object: Residence): ResidenceDto {
    return new ResidenceDto({
      ...object,
      ville_id: object.ville,
      commune_id: object.commune,
      ville: object.ville,
      commune: object.commune,
      ville_model: object.ville_model,
      commune_model: object.commune_model,
    });
  }

  mapTo(object: ResidenceDto): Residence {
    return new Residence(object);
  }
}
