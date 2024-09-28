import { Residence } from "@/core/domain/residences";
import { ResidenceDto } from "./residence.dto";
import { IMapper } from "@/lib/ts-utilities";

export class ResidenceDtoMapper implements IMapper<Residence, ResidenceDto> {
  mapFrom(object: Residence): ResidenceDto {
    return new ResidenceDto(object);
  }

  mapTo(object: ResidenceDto): Residence {
    return new Residence(object);
  }
}
