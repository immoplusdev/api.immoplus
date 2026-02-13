import { IMapper } from "@/lib/ts-utilities";
import { FurnitureEntity } from "./furniture.entity";
import { Furniture } from "@/core/domain/furniture";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class FurnitureEntityMapper
  implements IMapper<FurnitureEntity, Furniture>
{
  mapFrom(param: FurnitureEntity): Furniture {
    return new Furniture({
      ...param,
      owner: getIdFromObject(param.owner),
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
      video: getIdFromObject(param.video),
    });
  }

  mapTo(param: Furniture): FurnitureEntity {
    return new FurnitureEntity({
      ...param,
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
      video: getIdFromObject(param.video),
    });
  }
}
