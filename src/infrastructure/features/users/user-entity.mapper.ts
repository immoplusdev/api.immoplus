import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { User, UserData } from "@/core/domain/users";
import { UserEntity } from "./user.entity";
import { UserDataEntityMapper } from "@/infrastructure/features/users/user-data-entity.mapper";
import { UserDataEntity } from "@/infrastructure/features/users";


export class UserEntityMapper implements IMapper<UserEntity, User> {

  mapFrom(object: OmitMethods<UserEntity>): User {
    return new User({
      ...object,
      additionalData: new UserDataEntityMapper().mapFrom(object.additionalData as UserDataEntity),
    });
  }

  mapTo(object: OmitMethods<User>): UserEntity {
    return new UserEntity({
      ...object,
      additionalData: new UserDataEntityMapper().mapTo(object.additionalData as UserData),
    });
  }
}
