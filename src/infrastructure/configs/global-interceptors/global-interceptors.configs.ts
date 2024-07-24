import { INestApplication } from '@nestjs/common';
import { ResponseExceptionInterceptor } from 'src/infrastructure/core/interceptors/response-exception.interceptor';

export function globalInterceptorsConfig(app: INestApplication): void {
  app.useGlobalInterceptors(new ResponseExceptionInterceptor());
}
