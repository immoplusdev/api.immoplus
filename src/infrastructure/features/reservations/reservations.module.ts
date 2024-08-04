import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { ReservationController } from './reservations.controller';
import { ReservationRepository } from './reservations.repository';
import { EstimerPrixReservationQueryHandler } from "@/core/application/features/reservations";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigsModule } from "@/infrastructure/features/configs";
import { ResidenceModule } from "@/infrastructure/features/residences";

const queryHandler = [EstimerPrixReservationQueryHandler];
const commandHandlers = [];
const providers: Provider[] = [
  {
    provide: Deps.ReservationRepository,
    useClass: ReservationRepository,
  },
];

@Module({
  controllers: [ReservationController],
  imports: [TypeormModule, CqrsModule, ResidenceModule, ConfigsModule],
  providers: [...providers, ...queryHandler, ...commandHandlers],
  exports: [...providers],
})
export class ReservationModule {}
