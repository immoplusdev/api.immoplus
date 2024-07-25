import { Injectable, ConsoleLogger } from "@nestjs/common";
import { ILoggerService } from "@/core/domain/logging";



@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger: ConsoleLogger;
  constructor() {
    this.logger = new ConsoleLogger()
  }
  info(message: string, context?: unknown): void {
    this.logger.log(`Info: ${message}`, context)
  }

  error(message: string, context?: unknown): void {
    this.logger.error(message, context)
  }

  warn(message: string, context?: unknown): void {
    this.logger.warn(message, context)
  }
}
