import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { NotificationController } from "./notifications.controller";
import { NotificationRepository } from "./notifications.repository";
import { TypeormModule } from "@/infrastructure/typeorm";
import { SmsService } from "@/infrastructure/features/notifications/sms.service";
import { ConfigsModule } from "@/infrastructure/features/configs/configs.module";
import { LoggingModule } from "@/infrastructure/features/logging";
import { MailService } from "@/infrastructure/features/notifications/mail.service";
import { I18nModule } from "nestjs-i18n";

const providers: Provider[] = [
  {
    provide: Deps.NotificationRepository,
    useClass: NotificationRepository,
  },
  {
    provide: Deps.SmsService,
    useClass: SmsService,
  },
  {
    provide: Deps.MailService,
    useClass: MailService,
  }
];

@Module({
  controllers: [NotificationController],
  imports: [TypeormModule, ConfigsModule, LoggingModule],
  providers: [...providers],
  exports: [...providers],
})
export class NotificationModule {
}
