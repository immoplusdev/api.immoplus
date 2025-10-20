import { ExceptionFilter, Catch, ArgumentsHost, Inject } from "@nestjs/common";
import { Response } from "express";
import { BaseException } from "@/core/domain/common/exceptions";
import { IGlobalizationService } from "@/core/domain/globalization";
import { Deps } from "@/core/domain/common/ioc";

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
  ) {}

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Traduire le message si nécessaire
    let message = exception.message;
    if (message.includes("$t:")) {
      const translationKey = message.replace("$t:", "");
      message = this.globalizationService.t(translationKey, {
        args: exception.data,
      });
      console.log("Message: ", message);
    }

    // Format de réponse personnalisé
    const errorResponse = {
      statusCode: exception.statusCode,
      message: message,
      error: exception.error || "Error",
      code: exception.code,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      ...(exception.errors &&
        exception.errors.length > 0 && { errors: exception.errors }),
      ...(exception.data && { data: exception.data }),
    };

    const statusCode = exception.statusCode || 500;
    response.status(statusCode).json(errorResponse);
  }
}
