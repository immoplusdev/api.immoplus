import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import {
  compressionConfigs,
  swaggerConfigs,
  corsConfigs,
  globalInterceptorsConfig,
  configureAutoValidation,
  configureI18n,
  configureEnv,
  globalPipesConfig,
  configureExceptionFilters,
  NEST_SWAGGER_ENABLED,
} from "@/infrastructure/configs";

export async function applicationConfigs() {
  const app = await NestFactory.create(AppModule);
  configureEnv(app);
  compressionConfigs(app);
  corsConfigs(app);
  if (NEST_SWAGGER_ENABLED) swaggerConfigs(app);
  configureAutoValidation(app);
  configureExceptionFilters(app);
  globalInterceptorsConfig(app);
  globalPipesConfig(app);
  configureI18n(app);
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
