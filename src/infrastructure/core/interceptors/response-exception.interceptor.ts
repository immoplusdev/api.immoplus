import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseException } from '../../../core/domain/shared/exceptions';
import { UnexpectedException } from '../../../core/domain/shared/exceptions/unexpected.exception';

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
          } else {
            console.log('err', err);
            throw new UnexpectedException();
          }
        },
      ),
    );
  }
}
