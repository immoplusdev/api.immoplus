import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { BienImmobilierDto } from "./bien-immobilier.dto";


export class BienImmobilierDtoMapper implements IMapper<BienImmobilier, BienImmobilierDto> {
  mapFrom(object: OmitMethods<BienImmobilier>): BienImmobilierDto {
    return new BienImmobilierDto(object);
  }

  mapTo(object: OmitMethods<BienImmobilierDto>): BienImmobilier {
    return new BienImmobilier(object);
  }
}
