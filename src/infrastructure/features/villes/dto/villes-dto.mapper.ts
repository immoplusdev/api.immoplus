import { Ville } from "@/core/domain/villes";
import { VilleDto } from "./villes.dto";


export class VilleDtoMapper {
  mapFrom(object: Ville): VilleDto {
    return new VilleDto(object);
  }

  mapTo(object: VilleDto): Ville {
    return new Ville(object);
  }
}
