import { IAuthorizationManagerService } from "@/core/domain/auth";
import { UserWithRoleAndPermissions } from "@/core/domain/users";
import { Role } from "@/core/domain/roles";

export class AuthorizationManagerService
  implements IAuthorizationManagerService {
  constructor(private readonly user: UserWithRoleAndPermissions) {
  }

  canAccess(requiredRoles: string[], requiredPermissions: string[]): boolean {
    const rolesRequired = requiredRoles.length != 0;
    const permissionsRequired = requiredPermissions.length != 0;
    switch (true) {
      case !rolesRequired && !permissionsRequired:
        return true;
      case rolesRequired && permissionsRequired:
        return (
          this.hasRequiredRoles(requiredRoles) ||
          this.hasRequiredPermissions(requiredPermissions)
        );
      case rolesRequired:
        return this.hasRequiredRoles(requiredRoles);
      case permissionsRequired:
        return this.hasRequiredPermissions(requiredPermissions);
      default:
        return false;
    }
  }

  hasRequiredRoles(requiredRoles: string[]) {
    return requiredRoles.includes((this.user.role as Role).id);

  }

  hasRequiredPermissions(requiredPermissions: string[]) {
    for (const permission of this.user.permissions) {
      const permissionTag = `${permission.collectionName}:${permission.action}`;
      if (requiredPermissions.includes(permissionTag)) return true;
    }
    return false;
  }
}
