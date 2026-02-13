import { Furniture } from "@/core/domain/furniture";
import { FurnitureDto } from "./furniture.dto";
import { IMapper } from "@/lib/ts-utilities";

export class FurnitureDtoMapper implements IMapper<Furniture, FurnitureDto> {
  mapFrom(object: Furniture): FurnitureDto {
    return new FurnitureDto({
      ...object,
    });
  }

  mapTo(object: FurnitureDto): Furniture {
    return new Furniture(object);
  }
}
