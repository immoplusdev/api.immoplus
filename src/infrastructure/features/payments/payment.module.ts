import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { PaymentController } from "./payment.controller";
import { PaymentRepository } from "./payment.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { Hub2PaymentGatewayService } from "@/infrastructure/features/payments/hub2";
import { LoggingModule } from "@/infrastructure/features/logging";
import {
  CreatePaymentIntentCommandHandler,
  GetPaymentCollectionItemDataQueryHandler,
} from "@/core/application/features/payments";
import { ReservationModule } from "@/infrastructure/features/reservations";
import { DemandeVisiteModule } from "@/infrastructure/features/demandes-visites";

const queryHandler = [GetPaymentCollectionItemDataQueryHandler];
const commandHandlers = [CreatePaymentIntentCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.PaymentRepository,
    useClass: PaymentRepository,
  },
  {
    provide: Deps.PaymentGatewayService,
    useClass: Hub2PaymentGatewayService,
  },
];

@Module({
  controllers: [PaymentController],
  imports: [TypeormModule, CqrsModule, LoggingModule, ReservationModule, DemandeVisiteModule],
  providers: [...providers, ...queryHandler, ...commandHandlers],
  exports: [...providers],
})
export class PaymentModule {
}
