import { Injectable, ConsoleLogger, Inject } from "@nestjs/common";
import { ILoggerService } from "@/core/domain/logging";
import { IConfigsManagerService } from "@/core/domain/configs";
import { Deps } from "@/core/domain/shared/ioc";
import { AppProfile } from "@/core/domain/shared/enums";


@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger: ConsoleLogger;

  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configManagerService: IConfigsManagerService,
  ) {
    this.logger = new ConsoleLogger();
  }

  info(message: string, context?: unknown): void {
    this.logger.log(`Info: ${message}`, context);
    this.logContext(context);
  }

  error(message: string, context?: unknown): void {
    this.logger.error(message, context);
    this.logContext(context);
  }

  warn(message: string, context?: unknown): void {
    this.logger.warn(message, context);
    this.logContext(context);
  }

  private logContext(context?: unknown) {
    if (context && this.isProduction()) console.log(context);
  }

  private isProduction(): boolean {
    return this.configManagerService.getEnvVariable("NEST_APP_PROFILE") === AppProfile.Prod;
  }
}
