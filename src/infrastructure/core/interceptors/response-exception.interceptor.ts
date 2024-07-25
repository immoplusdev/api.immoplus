import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler, BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseException, UnexpectedException } from '@/core/domain/shared/exceptions';
import { FailedValidationException } from '@/core/domain/shared/exceptions/failed-validation.exception';

@Injectable()
export class ResponseExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(
        () => {
          // Do nothing
        },
        (err) => {
          if (err instanceof BaseException) {
            throw err;
          } else if (err instanceof BadRequestException) {
            const errResponse = err.getResponse();
            throw new FailedValidationException(
              (errResponse as any).message[0],
            );
          } else {
            console.log(err)
            throw new UnexpectedException();
          }
        },
      ),
    );
  }
}
