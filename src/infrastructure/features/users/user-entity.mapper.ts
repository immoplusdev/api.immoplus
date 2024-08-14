import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { User } from "@/core/domain/users";
import { UserEntity } from "./user.entity";


export class UserEntityMapper implements IMapper<UserEntity, User> {
  mapFrom(object: OmitMethods<UserEntity>): User {
    return new User(object);
  }

  mapTo(object: OmitMethods<User>): UserEntity {
    return new UserEntity(object);
  }
}
