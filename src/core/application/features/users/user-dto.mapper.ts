import { User } from "@/core/domain/users";
import { IMapper } from "@/lib/ts-utilities";
import { UserDto } from "@/core/application/features/users/index";


export class UserDtoMapper implements IMapper<User, UserDto> {

  mapFrom(object: User): UserDto {
    const newObject = new UserDto({ ...object });
    newObject.clearPassword();
    return newObject;
  }

  // mapListFrom(objects: User[]) {
  //   return objects.map((object) => this.mapFrom(object));
  // }

  mapTo(object: UserDto): User {
    return new User({ ...object });
  }

  // mapListTo(objects: UserDto[]) {
  //   return objects.map((object) => this.mapTo(object));
  // }
}
