import { Module, Provider } from "@nestjs/common";
import { I18nModule } from "nestjs-i18n";
import { ConfigModule } from "@nestjs/config";
import { i18Configs, jwtonfigs } from "@/infrastructure/configs";
import { GlobalPipesModule } from "@/infrastructure/pipes";
import { GlobalInterceptorsModule } from "@/infrastructure/interceptors";
import { TypeormModule } from "@/infrastructure/typeorm";
import { RestModule } from "@/infrastructure/rest/rest.module";

import { JwtModule } from "@nestjs/jwt";
import { GlobalizationModule } from "@/infrastructure/features/globalization";

const providers: Provider[] = [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeormModule,
    GlobalizationModule,
    GlobalInterceptorsModule,
    GlobalPipesModule,
    I18nModule.forRoot(i18Configs),
    JwtModule.register(jwtonfigs),
    RestModule,
  ],
  exports: [...providers],
  providers: [...providers],
})
export class AppModule {
}
