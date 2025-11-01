import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
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
import { join } from "path";

export async function applicationConfigs() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureEnv(app);
  compressionConfigs(app);
  corsConfigs(app);
  if (NEST_SWAGGER_ENABLED) swaggerConfigs(app);
  configureAutoValidation(app);
  configureExceptionFilters(app);
  globalInterceptorsConfig(app);
  globalPipesConfig(app);
  configureI18n(app);

  // Definir le repertoire des vues
  app.setBaseViewsDir(join(__dirname, "../../../..", "views"));

  // definir le moteur des vues
  app.setViewEngine("hbs");

  // Servir les fichiers statiques
  app.useStaticAssets(join(__dirname, "../../../..", "public"));

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
