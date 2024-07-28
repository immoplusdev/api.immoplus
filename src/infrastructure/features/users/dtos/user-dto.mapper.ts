import { User } from "@/core/domain/users";
import { UserDto } from "./users.dto";


export class UserDtoMapper {

  static mapFrom(object: User): UserDto {
    const newObject = new UserDto({ ...object });
    newObject.clearPassword();
    return newObject;
  }

  static mapListFrom(objects: User[]){
    return objects.map((object) => UserDtoMapper.mapFrom(object));
  }

  static mapTo(object: UserDto): User {
    return new User({ ...object });
  }

  static mapListTo(objects: UserDto[]){
    return objects.map((object) => UserDtoMapper.mapTo(object));
  }
}
