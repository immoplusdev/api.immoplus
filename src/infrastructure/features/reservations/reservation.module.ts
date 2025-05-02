import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/common/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import {
  AnnulerReservationByIdCommandHandler,
  CreateReservationCommandHandler,
  EstimerPrixReservationQueryHandler, GetResidenceOccupiedDateQueryHandler,
} from "@/core/application/reservations";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigsModule } from "@/infrastructure/features/configs";
import { ResidenceModule } from "@/infrastructure/features/residences";
import {
  GetReservationByIdQueryHandler
} from "@/core/application/reservations/get-reservation-by-id-query.handler";
import { UserModule } from "@/infrastructure/features/users/user.module";
import { ReservationService } from "@/infrastructure/features/reservations/reservation.service";
import { LoggingModule } from "@/infrastructure/features/logging";

const queryHandler = [EstimerPrixReservationQueryHandler, GetReservationByIdQueryHandler, GetResidenceOccupiedDateQueryHandler];
const commandHandlers = [CreateReservationCommandHandler, AnnulerReservationByIdCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.ReservationRepository,
    useClass: ReservationRepository,
  },
  {
    provide: Deps.ReservationService,
    useClass: ReservationService,
  },
];

@Module({
  controllers: [ReservationController],
  imports: [TypeormModule, CqrsModule, ResidenceModule, ConfigsModule, UserModule, LoggingModule],
  providers: [...providers, ...queryHandler, ...commandHandlers],
  exports: [...providers],
})
export class ReservationModule {}
