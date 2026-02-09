import { IMapper } from "@/lib/ts-utilities";
import { ResidenceEntity } from "./residence.entity";
import { Residence } from "@/core/domain/residences";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class ResidenceEntityMapper implements IMapper<
  ResidenceEntity,
  Residence
> {
  mapFrom(param: ResidenceEntity): Residence {
    return new Residence({
      ...param,
      miniature: getIdFromObject(param.miniature),
      video: getIdFromObject(param.video),
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
      ville_model: typeof param.ville === "object" ? param.ville : undefined,
      commune_model: typeof param.commune === "object" ? param.commune : undefined,
      proprietaire: getIdFromObject(param.proprietaire),
    });
  }

  mapTo(param: Residence): ResidenceEntity {
    return new ResidenceEntity({
      ...param,
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
    });
  }
}
