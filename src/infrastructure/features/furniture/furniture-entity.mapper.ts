import { IMapper } from "@/lib/ts-utilities";
import { FurnitureEntity } from "./furniture.entity";
import { Furniture } from "@/core/domain/furniture";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class FurnitureEntityMapper
  implements IMapper<FurnitureEntity, Furniture>
{
  mapFrom(param: FurnitureEntity): Furniture {
    const ownerId = getIdFromObject(param.owner);
    return new Furniture({
      ...param,
      owner: ownerId,
      ownerId,
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
      video: getIdFromObject(param.video),
    });
  }

  mapTo(param: Furniture): FurnitureEntity {
    const owner = getIdFromObject(param.owner ?? param.ownerId);
    return new FurnitureEntity({
      ...param,
      owner,
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
      video: getIdFromObject(param.video),
    });
  }
}
