import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
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

  handleRequest(err, user, info) {
    const requiredRoles = this.requiredRoles ? this.requiredRoles : [];
    const requiredPermissions = this.requiredPermissions
      ? this.requiredPermissions
      : [];

    // Gestion des erreurs d'authentification JWT
    if (err || !user) {
      if (info) {
        // Analyser le type d'erreur JWT
        switch (info.name) {
          case "TokenExpiredError":
            throw new UnauthorizedException({
              statusCode: 401,
              error: "Unauthorized",
              message: "$t:all.exception.jwt_token_expired",
              code: "JWT_TOKEN_EXPIRED",
            });

          case "JsonWebTokenError":
            throw new UnauthorizedException({
              statusCode: 401,
              error: "Unauthorized",
              message: "$t:all.exception.invalid_jwt_token",
              code: "JWT_TOKEN_INVALID",
            });

          case "NotBeforeError":
            throw new UnauthorizedException({
              statusCode: 401,
              error: "Unauthorized",
              message: "$t:all.exception.jwt_token_not_active",
              code: "JWT_TOKEN_NOT_ACTIVE",
            });

          default:
            throw new UnauthorizedException({
              statusCode: 401,
              error: "Unauthorized",
              message: "$t:all.exception.authentication_failed",
              code: "AUTHENTICATION_FAILED",
            });
        }
      }

      // Cas où le token n'existe pas
      throw new UnauthorizedException({
        statusCode: 401,
        error: "Unauthorized",
        message: "$t:all.exception.jwt_token_required",
        code: "JWT_TOKEN_MISSING",
      });
    }

    // Vérification des autorisations
    if (requiredRoles.length != 0 || requiredPermissions.length != 0) {
      const authorizationManagerService = new AuthorizationManagerService(user);

      if (
        !authorizationManagerService.canAccess(
          requiredRoles,
          requiredPermissions,
        )
      ) {
        throw new ForbiddenException({
          statusCode: 403,
          error: "Forbidden",
          message: "$t:all.exception.insufficient_permissions",
          code: "INSUFFICIENT_PERMISSIONS",
        });
      }
    }

    user.role = new Role(user.role);
    return new User(user) as never;
  }
}
