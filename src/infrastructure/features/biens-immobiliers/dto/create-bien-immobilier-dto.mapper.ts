import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { CreateBienImmobilierDto } from "./create-bien-immobilier.dto";


export class CreateBienImmobilierDtoMapper implements IMapper<CreateBienImmobilierDto, BienImmobilier> {
  mapFrom(object: OmitMethods<CreateBienImmobilierDto>): BienImmobilier {
    return new BienImmobilier(object as never);
  }

  mapTo(object: Partial<BienImmobilier>): CreateBienImmobilierDto {
    return new CreateBienImmobilierDto(object as never);
  }
}
