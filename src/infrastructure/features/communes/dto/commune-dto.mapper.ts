import { Commune } from "@/core/domain/communes";
import { CommuneDto } from "./commune.dto";
import { castItem, IMapper } from "@/lib/ts-utilities";
import { Ville } from "@/core/domain/villes";


export class CommuneDtoMapper implements IMapper<Commune, CommuneDto> {
  mapFrom(object: Commune): CommuneDto {
    const output = new CommuneDto({
      ...object,
      villeId: (object.ville as Ville)?.id || object.ville as string,
    });
    delete castItem(output).ville;
    return output;
  }

  mapTo(object: CommuneDto): Commune {
    return new Commune({ ...object, ville: object.villeId });
  }
}
