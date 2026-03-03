import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  BaseException,
  UnexpectedException,
} from "@/core/domain/common/exceptions";
import { FailedValidationException } from "@/core/domain/common/exceptions/failed-validation.exception";
import { Deps } from "@/core/domain/common/ioc";
import { IGlobalizationService } from "@/core/domain/globalization";
import { ILoggerService } from "@/core/domain/logging";
import { IConfigsManagerService } from "@/core/domain/configs";

@Injectable()
export class ResponseExceptionInterceptor implements NestInterceptor {
  constructor(
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.LoggerService)
    private readonly loggerService: ILoggerService,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {
    //
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(
        () => {
          // Do nothing
        },
        (err) => {
          if (err instanceof BaseException) {
            // Les BaseException sont maintenant gérées par le BaseExceptionFilter
            throw err;
          } else if (err instanceof BadRequestException) {
            const errResponse = err.getResponse() as {
              message?: string | string[];
            };
            const msg = errResponse?.message;
            const messageStr = Array.isArray(msg)
              ? (msg[0] ?? msg.join(", "))
              : (msg ?? "Requête invalide");
            throw new FailedValidationException(messageStr);
          } else {
            if (!this.configsManagerService.isAppProfileProduction()) {
              this.loggerService.error("App Exception", err);
              // En développement, afficher le message technique
              throw new UnexpectedException(
                err.message ?? `$t:all.exception.something_went_wrong`,
              );
            }
            // En production, toujours retourner un message personnalisé
            throw new UnexpectedException(
              `$t:all.exception.something_went_wrong`,
            );
          }
        },
      ),
    );
  }

  translateExceptionMessage(exception: BaseException): BaseException {
    if (exception.message.includes("$t:")) {
      const message = exception.message.replace("$t:", "");
      const translation = this.globalizationService.t(message, {
        args: exception.data,
      });
      exception.setMessage(translation);
    }
    return exception;
  }
}
