import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { ConfigsManagerService } from "./configs-manager.service";
import { ConfigModule } from "@nestjs/config";
import { AppConfigsRepository } from "@/infrastructure/features/configs/configs.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigController } from "@/infrastructure/features/configs/configs.controller";
import { GlobalizationModule } from "@/infrastructure/features/globalization";
import { TypeormModule } from "@/infrastructure/typeorm";

const providers: Provider[] = [
  {
    provide: Deps.AppConfigsRepository,
    useClass: AppConfigsRepository,
  },
  {
    provide: Deps.ConfigsManagerService,
    useClass: ConfigsManagerService,
  },
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    TypeormModule,
    GlobalizationModule,
  ],
  controllers: [ConfigController],
  providers: [...providers],
  exports: [...providers],
})

export class ConfigsModule {
}
