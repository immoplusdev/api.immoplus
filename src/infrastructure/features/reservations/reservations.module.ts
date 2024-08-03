import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { ReservationController } from './reservations.controller';
import { ReservationRepository } from './reservations.repository';

const providers: Provider[] = [
  {
    provide: Deps.ReservationRepository,
    useClass: ReservationRepository,
  },
];

@Module({
  controllers: [ReservationController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class ReservationModule {}
