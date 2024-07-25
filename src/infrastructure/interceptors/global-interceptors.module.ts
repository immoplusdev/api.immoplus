import { Module, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseExceptionInterceptor } from './response-exception.interceptor';

const interceptors: Provider[] = [ResponseExceptionInterceptor];

const interceptorsProviders: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseExceptionInterceptor,
  },
];

@Module({
  imports: [],
  providers: [...interceptorsProviders, ...interceptors],
  exports: [...interceptors],
})
export class GlobalInterceptorsModule {}
