import { Residence, StatusValidationResidence } from "@/core/domain/residences";
import { ResidenceDto } from "./residences.dto";
import { IMapper } from "@/lib/ts-utilities";
import { File} from "@/core/domain/files";

export class ResidenceDtoMapper implements IMapper<Residence, ResidenceDto> {
  mapFrom(object: Residence): ResidenceDto {
    return new ResidenceDto({
      ...object,
    });
  }

  mapTo(object: ResidenceDto): Residence {
    return new Residence({
      ...object,
      statusValidation: StatusValidationResidence.EnAttenteValidation,
      miniature: null,
    });
  }
}
