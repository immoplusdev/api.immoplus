import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { NotificationController } from './notifications.controller';
import { NotificationRepository } from './notifications.repository';
import { TypeormModule } from "@/infrastructure/typeorm";
import { SmsServiceService } from "@/infrastructure/features/notifications";

const providers: Provider[] = [
  {
    provide: Deps.NotificationRepository,
    useClass: NotificationRepository,
  },
  {
    provide: Deps.SmsServiceService,
    useClass: SmsServiceService,
  },
];

@Module({
  controllers: [NotificationController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class NotificationModule {}
