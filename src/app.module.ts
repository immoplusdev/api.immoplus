import { Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import { ConfigModule } from '@nestjs/config';


import { i18Configs, jwtonfigs } from '@/infrastructure/configs';
import { GlobalPipesModule } from '@/infrastructure/pipes';
import { GlobalInterceptorsModule } from '@/infrastructure/interceptors';
import { TypeormModule } from '@/infrastructure/typeorm';
import { RestModule } from '@/infrastructure/rest/rest.module';
import { AppService } from './app.service';

import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeormModule,
    GlobalInterceptorsModule,
    GlobalPipesModule,
    I18nModule.forRoot(i18Configs),
    JwtModule.register(jwtonfigs),
    RestModule,
  ],
  providers: [AppService],
})
export class AppModule {}
