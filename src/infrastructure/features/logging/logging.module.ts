import { forwardRef, Module, Provider } from "@nestjs/common";
import { LoggerService } from "@/infrastructure/features/logging/logger.service";
import { Deps } from "@/core/domain/common/ioc";
import { ConfigsModule } from "@/infrastructure/features/configs";

const providers: Provider[] = [
  {
    provide: Deps.LoggerService,
    useClass: LoggerService,
  },
];

@Module({
  imports: [forwardRef(() => ConfigsModule)],
  providers: [...providers],
  exports: [...providers],
})

export class LoggingModule {}
