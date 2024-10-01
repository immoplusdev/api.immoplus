import { Commune } from "@/core/domain/communes";
import { CommuneDto } from "./commune.dto";
import { IMapper } from "@/lib/ts-utilities";

export class CommuneDtoMapper implements IMapper<Commune, CommuneDto> {
  mapFrom(object: Commune): CommuneDto {
    return new CommuneDto(object);
  }

  mapTo(object: CommuneDto): Commune {
    return new Commune(object);
  }
}
