import { forwardRef, Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { NotificationController } from "./notification.controller";
import { NotificationRepository } from "./notification.repository";
import { TypeormModule } from "@/infrastructure/typeorm";
import { SmsService } from "@/infrastructure/features/notifications/sms.service";
import { ConfigsModule } from "@/infrastructure/features/configs/configs.module";
import { LoggingModule } from "@/infrastructure/features/logging";
import { MailService } from "@/infrastructure/features/notifications/mail.service";
import { NotificationService } from "./notification.service";
import { UserModule, UserRepository } from "@/infrastructure/features/users";

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
    provide: Deps.NotificationService,
    useClass: NotificationService,
  },
  {
    provide: Deps.MailService,
    useClass: MailService,
  }
];

@Module({
  controllers: [NotificationController],
  imports: [
    TypeormModule,
    UserModule,
    forwardRef(() => ConfigsModule),
    forwardRef(() => LoggingModule),
  ],
  providers: [...providers],
  exports: [...providers],
})
export class NotificationModule {}
