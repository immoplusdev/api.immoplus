import { IMapper } from "@/lib/ts-utilities";
import { ResidenceEntity } from "./residence.entity";
import { Residence } from "@/core/domain/residences";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class ResidenceEntityMapper
  implements IMapper<ResidenceEntity, Residence>
{
  mapFrom(param: ResidenceEntity): Residence {
    return new Residence({
      ...param,
      miniature: getIdFromObject(param.miniature),
      video: getIdFromObject(param.video),
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
      proprietaire: getIdFromObject(param.proprietaire),
    });
  }

  mapTo(param: Residence): ResidenceEntity {
    return new ResidenceEntity({
      ...param,
    });
  }
}
