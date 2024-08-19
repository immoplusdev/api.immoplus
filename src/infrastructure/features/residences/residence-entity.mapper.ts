import { IMapper } from "@/lib/ts-utilities";
import { ResidenceEntity } from "./residence.entity";
import { Residence } from "@/core/domain/residences";

export class ResidenceEntityMapper implements IMapper<ResidenceEntity, Residence> {
  mapFrom(param: ResidenceEntity): Residence {
    return new Residence(param);
  }

  mapTo(param: Residence): ResidenceEntity {
    return new ResidenceEntity({
      ...param
    });
  }
}