import { INestApplication } from "@nestjs/common";
import { ResponseExceptionInterceptor } from "@/infrastructure/interceptors/response-exception.interceptor";

export function globalInterceptorsConfig(_app: INestApplication): void {
  // app.useGlobalInterceptors(app.get(ResponseExceptionInterceptor));
}
