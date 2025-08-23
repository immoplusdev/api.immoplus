import { User, UserData } from "@/core/domain/users";
import { IMapper, omitObjectProperties } from "@/lib/ts-utilities";
import { UserDto } from "./user.dto";
import { UserDataDtoMapper } from "@/core/application/users/user-data-dto.mapper";

export class UserDtoMapper implements IMapper<User, UserDto> {
  mapFrom(object: User): UserDto {
    const params = omitObjectProperties(object, ["additionalData"]);
    const newObject = new UserDto({
      ...params,
      additionalData: new UserDataDtoMapper().mapFrom(
        object.additionalData as UserData,
      ),
    });
    newObject.clearPrivateCredentials();
    return newObject;
  }

  mapTo(object: UserDto): User {
    return new User({
      ...object,
      additionalData: object.additionalData as never,
    });
  }
}
