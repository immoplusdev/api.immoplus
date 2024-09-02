import { Residence } from "@/core/domain/residences";
import { ResidenceDto } from "./residence.dto";
import { IMapper, omitObjectProperties } from "@/lib/ts-utilities";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";

export class ResidenceDtoMapper implements IMapper<Residence, ResidenceDto> {
  mapFrom(object: Residence): ResidenceDto {
    return omitObjectProperties(new ResidenceDto({
      ...object,
    }), ["proprietaire"]);
  }

  mapTo(object: ResidenceDto): Residence {
    return new Residence({
      ...object,
      statusValidation: StatusValidationBienImmobilier.EnAttenteValidation,
      miniature: object.miniatureId,
      proprietaireId: object.proprietaireId,
    });
  }
}
