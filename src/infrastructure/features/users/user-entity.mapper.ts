import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { User, UserData } from "@/core/domain/users";
import { UserEntity } from "./user.entity";
import { UserDataEntityMapper } from "./user-data-entity.mapper";
import { UserDataEntity } from "@/infrastructure/features/users";


export class UserEntityMapper implements IMapper<UserEntity, User> {

  mapFrom(object: OmitMethods<UserEntity>): User {
    return new User({
      ...object,
      avatar: object.avatar ? (object.avatar as any).id : null,
      additionalData: new UserDataEntityMapper().mapFrom(object.additionalData as UserDataEntity),
    });
  }

  mapTo(object: OmitMethods<User>): UserEntity {
    return new UserEntity({
      ...object,
      avatar: object.avatar ? (object.avatar as any).id : null,
      additionalData: new UserDataEntityMapper().mapTo(object.additionalData as UserData),
    });
  }
}
