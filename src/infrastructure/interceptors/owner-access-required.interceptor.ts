import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler, BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BaseException, UnexpectedException } from "@/core/domain/shared/exceptions";
import { FailedValidationException } from "@/core/domain/shared/exceptions/failed-validation.exception";

@Injectable()
export class OwnerAccessRequiredInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(
        () => {
          console.log("here")
        },
      ),
    );
  }
}
