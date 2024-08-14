import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierEntity } from "./bien-immobilier.entity";


export class BienImmobilierEntityMapper implements IMapper<BienImmobilierEntity, BienImmobilier> {
  mapFrom(object: OmitMethods<BienImmobilierEntity>): BienImmobilier {
    return new BienImmobilier(object);
  }

  mapTo(object: OmitMethods<BienImmobilier>): BienImmobilierEntity {
    return new BienImmobilierEntity(object);
  }
}
