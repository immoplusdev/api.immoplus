import { Residence } from "@/core/domain/residences";
import { ResidenceDto } from "./residences.dto";


export class ResidenceDtoMapper {
  mapFrom(object: Residence): ResidenceDto {
    return new ResidenceDto(object);
  }

  mapTo(object: ResidenceDto): Residence {
    return new Residence(object);
  }
}
