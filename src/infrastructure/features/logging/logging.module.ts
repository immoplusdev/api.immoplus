import { Module, Provider } from "@nestjs/common";
import { LoggerService } from "@/infrastructure/features/logging/logger.service";
import { Deps } from "@/core/domain/shared/ioc";

const providers: Provider[] = [
  {
    provide: Deps.LoggerService,
    useClass: LoggerService,
  },
];

@Module({
  imports: [],
  providers: [...providers],
  exports: [...providers],
})

export class LoggingModule {
}
