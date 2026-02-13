import { IMapper } from "@/lib/ts-utilities";
import { FurnitureEntity } from "./furniture.entity";
import { Furniture } from "@/core/domain/furniture";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class FurnitureEntityMapper
  implements IMapper<FurnitureEntity, Furniture>
{
  mapFrom(param: FurnitureEntity): Furniture {
    const ownerId = getIdFromObject(param.owner);
    const rawMetadata = (param.metadata ?? {}) as {
      colors?: string[];
      types?: string[];
      categories?: string[];
      etat?: "neuf" | "reconditionne" | "occasion";
    };

    const normalizedType = param.type ?? rawMetadata.types?.[0] ?? "non-specifie";
    const normalizedCategory =
      param.category ?? rawMetadata.categories?.[0] ?? "non-specifie";
    const normalizedEtat = (param.etat ??
      rawMetadata.etat ??
      "occasion") as "neuf" | "reconditionne" | "occasion";

    return new Furniture({
      ...param,
      owner: ownerId,
      ownerId,
      ville: getIdFromObject(param.ville),
      commune: getIdFromObject(param.commune),
      video: getIdFromObject(param.video),
      type: normalizedType,
      category: normalizedCategory,
      etat: normalizedEtat,
      metadata: {
        colors: rawMetadata.colors,
      },
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
      metadata: param.metadata,
    });
  }
}
