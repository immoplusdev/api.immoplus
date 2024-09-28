import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler, Inject,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Deps } from "@/core/domain/shared/ioc";
import { IGlobalizationService } from "@/core/domain/globalization";
import { ILoggerService } from "@/core/domain/logging";
import { IConfigsManagerService } from "@/core/domain/configs";
import { OWNER_ACCESS_REQUIRED_FIELD_KEY, OWNER_ACCESS_REQUIRED_KEY } from "@/infrastructure/decorators";
import { Reflector } from "@nestjs/core";
import { verifyResourceListOwnership, verifyResourceOwnership } from "@/infrastructure/features/auth/helpers";

// TODO: Implement the OwnerAccessRequiredInterceptor
@Injectable()
export class OwnerAccessRequiredInterceptor implements NestInterceptor {
  constructor(
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.LoggerService)
    private readonly loggerService: ILoggerService,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
    private readonly reflector: Reflector,
  ) {
    //
  }

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const verifyOwnership = this.reflector.get<boolean>(OWNER_ACCESS_REQUIRED_KEY, ctx.getHandler());
    if (!verifyOwnership) return next.handle();
    const ownerField = this.reflector.get<string>(OWNER_ACCESS_REQUIRED_FIELD_KEY, ctx.getHandler());
    const user = ctx.switchToHttp().getRequest().user;

    return next.handle().pipe(
      tap(
        (data) => {
          const resource = data?.data;
          if (!resource) return;
          if (Array.isArray(resource)) {
            verifyResourceListOwnership(
              { ressources: resource, userId: user.id, ownerField: ownerField, userRole: user.role.id },
            );
          } else {
            verifyResourceOwnership(
              { userId: user.id, ownerId: resource[ownerField], userRole: user.role.id },
            );
          }
        },
        (err) => {

        },
      ),
    );
  }


}
