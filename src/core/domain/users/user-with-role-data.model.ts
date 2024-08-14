import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "@/core/domain/users/user.model";
import { Role } from "@/core/domain/roles";

export class UserWithRoleData extends User {
  roleData: Role;

  constructor(data?: OmitMethods<UserWithRoleData>) {
    if (data) super({
      ...data,
    });
  }
}
