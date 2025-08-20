import { IMapper, OmitMethods, omitObjectProperties } from "@/lib/ts-utilities";
import { UserData } from "@/core/domain/users";
import { UserDataDto } from "./user-data.dto";

export class UserDataDtoMapper implements IMapper<UserData, UserDataDto> {
  mapFrom(object: OmitMethods<UserData>): UserDataDto {
    const params = omitObjectProperties(object, [
      "photoIdentite",
      "pieceIdentite",
      "registreCommerce",
    ]);
    return new UserDataDto({
      ...params,
      registreCommerceId: (object.registreCommerce as Record<string, any>)?.id,
      pieceIdentiteId: (object.pieceIdentite as Record<string, any>)?.id,
      photoIdentiteId: (object.photoIdentite as Record<string, any>)?.id,
    });
  }

  mapTo(object: OmitMethods<UserDataDto>): UserData {
    return new UserData(object);
  }
}
