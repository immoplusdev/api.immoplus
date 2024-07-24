import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { GlobalInterceptorsModule } from './infrastructure/core/interceptors/global-interceptors.module';
// import { RestModule } from './infrastructure/rest-adapter/rest.module';
// import { MongoAdapterModule } from './infrastructure/mongo-adapter/mongo-adapter.module';
// import { CrudAdapterModule } from './infrastructure/crud-adapter/crud-adapter.module';
import { I18nModule } from 'nestjs-i18n';
import { i18Configs } from '@/infrastructure/configs/i18n/i18n.configs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtonfigs } from '@/infrastructure/configs/auth/jwt.configs';
import { GlobalPipesModule } from './infrastructure/core/pipes/global-pipes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // RestModule,
    // MongoAdapterModule,
    // TypeormAdapterModule,
    GlobalInterceptorsModule,
    GlobalPipesModule,
    I18nModule.forRoot(i18Configs),
    PassportModule,
    JwtModule.register(jwtonfigs),
    // CrudAdapterModule,
  ],
  providers: [AppService],
})
export class AppModule {}
