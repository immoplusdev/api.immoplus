import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { ConfigsManagerService } from "./configs-manager.service";
import { ConfigModule } from "@nestjs/config";
import { AppConfigsRepository } from "@/infrastructure/features/configs/configs.repository";
import { TypeormModule } from "@/infrastructure/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigController } from "@/infrastructure/features/configs/configs.controller";

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
  imports: [ConfigModule, TypeormModule, CqrsModule],
  controllers: [ConfigController],
  providers: [...providers],
  exports: [...providers],
})

export class ConfigsModule {}