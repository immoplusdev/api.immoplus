import { IMapper } from "@/lib/ts-utilities";
import { ResidenceEntity } from "./residence.entity";
import { Residence } from "@/core/domain/residences";

export class ResidenceEntityMapper implements IMapper<ResidenceEntity, Residence> {
  mapFrom(param: ResidenceEntity): Residence {
    const object = new Residence({ ...param, proprietaireId: null });
    if (typeof param?.proprietaire === "object") object.proprietaireId = param?.proprietaire?.id as string;
    return object;
  }

  mapTo(param: Residence): ResidenceEntity {
    return new ResidenceEntity({
      ...param,
    });
  }
}