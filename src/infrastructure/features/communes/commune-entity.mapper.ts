import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { CommuneEntity } from "@/infrastructure/features/communes/commune.entity";
import { Commune } from "@/core/domain/communes";
import { getIdFromObject } from "@/lib/ts-utilities/mapping";

export class CommuneEntityMapper implements IMapper<CommuneEntity, Commune> {
  mapFrom(params: OmitMethods<CommuneEntity>): Commune {
    return new Commune({
      ...params,
      ville: getIdFromObject(params.ville),
    });
  }

  mapTo(object: OmitMethods<Commune>): CommuneEntity {
    return new CommuneEntity({
      ...object,
      ville: getIdFromObject(object.ville),
    });
  }
}
