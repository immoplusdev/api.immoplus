import { OmitMethods } from "@/lib/ts-utilities";
import { Permission } from "@/core/domain/permissions";
import { User } from "./user.model";

export class UserWithRoleAndPermissions extends User {
  permissions: Permission[];
  constructor(data?: OmitMethods<UserWithRoleAndPermissions>) {
    if (data)
      super({
        ...data,
      });
  }
}
