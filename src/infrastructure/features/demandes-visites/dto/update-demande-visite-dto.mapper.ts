import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { UpdateDemandeVisiteDto } from "./update-demande-visite.dto";


export class UpdateDemandeVisiteDtoMapper implements IMapper<UpdateDemandeVisiteDto, DemandeVisite> {
  mapFrom(object: OmitMethods<UpdateDemandeVisiteDto>): DemandeVisite {
    return new DemandeVisite(object as never);
  }

  mapTo(object: Partial<DemandeVisite>): UpdateDemandeVisiteDto {
    return new UpdateDemandeVisiteDto(object as never);
  }
}
