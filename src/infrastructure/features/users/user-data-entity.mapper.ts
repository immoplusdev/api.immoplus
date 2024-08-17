import { IMapper, OmitMethods } from "@/lib/ts-utilities";
import { UserData } from "@/core/domain/users";
import { UserDataEntity } from "@/infrastructure/features/users";


export class UserDataEntityMapper implements IMapper<UserDataEntity, UserData> {
  mapFrom(object: OmitMethods<UserDataEntity>): UserData {
    return new UserData({
      ...object
    });
  }

  mapTo(object: OmitMethods<UserData>): UserDataEntity {
    return new UserDataEntity(object);
  }
}
