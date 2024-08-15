import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { DemandeVisite } from "@/core/domain/demandes-visites";
import { CreateDemandeVisiteDto } from "./create-demande-visite.dto";


export class CreateDemandeVisiteDtoMapper implements IMapper<CreateDemandeVisiteDto, DemandeVisite> {
  mapFrom(object: OmitMethods<CreateDemandeVisiteDto>): DemandeVisite {
    return new DemandeVisite(object as never);
  }

  mapTo(object: Partial<DemandeVisite>): CreateDemandeVisiteDto {
    return new CreateDemandeVisiteDto(object as never);
  }
}
