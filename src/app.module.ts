import { Module, Provider } from "@nestjs/common";
import { I18nModule } from "nestjs-i18n";
import { ConfigModule } from "@nestjs/config";
import { i18Configs, jwtConfigs } from "@/infrastructure/configs";
import { TypeormModule } from "@/infrastructure/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { GlobalizationModule } from "@/infrastructure/features/globalization";
import { GlobalInterceptorsModule } from "@/infrastructure/interceptors/global-interceptors.module";
import { RestModule } from "@/infrastructure/presentation/rest/rest.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TransfersModule } from "./infrastructure/features/transfers/transfers.module";
import { GlobalPipesModule } from "@/infrastructure/pipes";
import { MinioModule } from "@/infrastructure/features/files";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

const providers: Provider[] = [AppService];

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeormModule,
    GlobalizationModule,
    GlobalInterceptorsModule,
    GlobalPipesModule,
    I18nModule.forRoot(i18Configs),
    JwtModule.register(jwtConfigs),
    MinioModule,
    RestModule,
    TransfersModule,
  ],
  exports: [...providers],
  providers: [...providers],
})
export class AppModule {}
