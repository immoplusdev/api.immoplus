import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { UpdateBienImmobilierDto } from "./update-bien-immobilier.dto";

export class UpdateBienImmobilierDtoMapper
  implements IMapper<UpdateBienImmobilierDto, BienImmobilier>
{
  mapFrom(object: OmitMethods<UpdateBienImmobilierDto>): BienImmobilier {
    return new BienImmobilier(object as never);
  }

  mapTo(object: Partial<BienImmobilier>): UpdateBienImmobilierDto {
    return new UpdateBienImmobilierDto(object as never);
  }
}
