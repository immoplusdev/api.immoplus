import { INestApplication } from '@nestjs/common';
import { ResponseExceptionInterceptor } from '@/infrastructure/interceptors/response-exception.interceptor';

export function globalInterceptorsConfig(app: INestApplication): void {
  app.useGlobalInterceptors(new ResponseExceptionInterceptor());
}
