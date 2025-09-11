import { INestApplication } from "@nestjs/common";
import { BaseExceptionFilter } from "@/infrastructure/filters";
import { Deps } from "@/core/domain/common/ioc";

export function configureExceptionFilters(app: INestApplication) {
  const globalizationService = app.get(Deps.GlobalizationService);
  app.useGlobalFilters(new BaseExceptionFilter(globalizationService));
}
