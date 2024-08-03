import { AutoMapper, IMapper } from "@/lib/ts-utilities";
import { Commune } from "@/core/domain/communes";
import { CommuneDto } from "./communes.dto";


export class CommuneDtoMapper {
  mapFrom(object: Commune): CommuneDto {
    return new CommuneDto(object);
  }

  mapTo(object: CommuneDto): Commune {
    return new Commune(object);
  }
}
