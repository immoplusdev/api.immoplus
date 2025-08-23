import { Module, Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseExceptionInterceptor } from "./response-exception.interceptor";
import { LoggingModule } from "@/infrastructure/features/logging";
import { ConfigsModule } from "@/infrastructure/features/configs";
import { GlobalizationModule } from "@/infrastructure/features/globalization";
import { OwnerAccessRequiredInterceptor } from "@/infrastructure/interceptors";

const interceptors: Provider[] = [ResponseExceptionInterceptor];

const interceptorsProviders: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseExceptionInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: OwnerAccessRequiredInterceptor,
  },
];

@Module({
  imports: [LoggingModule, ConfigsModule, GlobalizationModule],
  providers: [...interceptorsProviders, ...interceptors],
  exports: [...interceptors],
})
export class GlobalInterceptorsModule {}
