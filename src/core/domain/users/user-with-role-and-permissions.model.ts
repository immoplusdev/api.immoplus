import { OmitMethods } from '@/lib/ts-utilities';
import { User } from "@/core/domain/users/user.model";
import { Role } from "@/core/domain/roles";
import { Permission } from "@/core/domain/permissions";

export class UserWithRoleAndPermissions extends User {
  permissions: Permission[]
  constructor(data?: OmitMethods<UserWithRoleAndPermissions>) {
    if (data) super({
      ...data,
    });
  }
}