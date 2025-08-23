import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { AuthorizationManagerService } from "@/infrastructure/features/auth/authorization-manager.service";
import { Role } from "@/core/domain/roles";
import { User } from "@/core/domain/users";
import { UnauthorizedException } from "@/core/domain/auth";
import { PERMISSIONS_KEY, ROLES_KEY } from "@/infrastructure/decorators";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private requiredRoles: string[];
  private requiredPermissions: string[];

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    return super.canActivate(context);
  }

  handleRequest(err, user, _info) {
    const requiredRoles = this.requiredRoles ? this.requiredRoles : [];
    const requiredPermissions = this.requiredPermissions
      ? this.requiredPermissions
      : [];
    if (requiredRoles.length != 0 || requiredPermissions.length != 0) {
      if (err || !user) throw err || new UnauthorizedException();
    }

    const authorizationManagerService = new AuthorizationManagerService(user);
    if (
      !authorizationManagerService.canAccess(requiredRoles, requiredPermissions)
    )
      throw new UnauthorizedException();

    user.role = new Role(user.role);
    return new User(user) as never;
  }
}
