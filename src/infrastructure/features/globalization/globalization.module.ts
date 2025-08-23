import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { GlobalizationService } from "@/infrastructure/features/globalization";
import { I18nModule, I18nService } from "nestjs-i18n";
import { i18Configs } from "@/infrastructure/configs";

const providers: Provider[] = [
  {
    provide: Deps.GlobalizationService,
    inject: [I18nService],
    useFactory: (i18n: I18nService) => {
      return new GlobalizationService(i18n);
    },
  },
];

@Module({
  imports: [I18nModule.forRoot(i18Configs)],
  providers: [...providers],
  exports: [...providers],
})
export class GlobalizationModule {}
