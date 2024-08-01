import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { compressionConfigs } from "../compression/compression.configs";
import { corsConfigs } from "../cors/cors.configs";
import { swaggerConfigs } from "../swagger/swagger.configs";
import { globalInterceptorsConfig } from "../global-interceptors/global-interceptors.configs";
import { configureAutoValidation } from "../validation/class-validator";
import { configureI18n } from "../i18n/i18n.configs";
import { configureEnv } from "../environments/env.configs";
import { globalPipesConfig } from "../global-pipes/global.pipes";
import { NEST_SWAGGER_ENABLED } from "@/infrastructure/configs";

export async function applicationConfigs() {
  const app = await NestFactory.create(AppModule);
  configureEnv(app);
  compressionConfigs(app);
  corsConfigs(app);
  if (NEST_SWAGGER_ENABLED) swaggerConfigs(app);
  configureAutoValidation(app);
  globalInterceptorsConfig(app);
  globalPipesConfig(app);
  configureI18n(app);
  await app.listen(process.env.PORT || 3000);
}
