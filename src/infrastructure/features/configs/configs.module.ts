import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { ConfigsManagerService } from "./configs-manager.service";
import { ConfigModule } from "@nestjs/config";

const providers: Provider[] = [
  {
    provide: Deps.ConfigsManagerService,
    useClass: ConfigsManagerService,
  },
];

@Module({
  imports: [ConfigModule],
  providers: [...providers],
  exports: [...providers],
})

export class ConfigsModule {}