import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { PaymentController } from "./payment.controller";
import { PaymentRepository } from "./payment.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { Hub2PaymentGatewayService } from "@/infrastructure/features/payments/hub2";
import { LoggingModule } from "@/infrastructure/features/logging";
import {
  CreateDemandeRetraitReservationCommandHandler,
  CreatePaymentIntentCommandHandler,
  GetPaymentCollectionItemDataQueryHandler,
  InterceptPaymentWebhookCommandHandler,
  PaymentDemandeVisiteValideEventHandler,
} from "@/core/application/features/payments";
import { ReservationModule } from "@/infrastructure/features/reservations";
import { DemandeVisiteModule } from "@/infrastructure/features/demandes-visites";
import {
  AuthenticatePaymentIntentCommandHandler,
} from "@/core/application/features/payments/authenticate-payment-intent-command.handler";
import { NotificationModule } from "@/infrastructure/features/notifications";
import {
  PaymentReservationValideEventHandler,
} from "@/core/application/features/payments/payment-reservation-valide.event";
import { GlobalizationModule, GlobalizationService } from "@/infrastructure/features/globalization";
import { ConfigsModule } from "@/infrastructure/features/configs";

const queryHandler = [GetPaymentCollectionItemDataQueryHandler];
const commandHandlers = [CreatePaymentIntentCommandHandler, InterceptPaymentWebhookCommandHandler, AuthenticatePaymentIntentCommandHandler, CreateDemandeRetraitReservationCommandHandler];
const eventHandlers = [PaymentDemandeVisiteValideEventHandler, PaymentReservationValideEventHandler];

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
  imports: [TypeormModule, CqrsModule,ConfigsModule, LoggingModule, ReservationModule, DemandeVisiteModule, NotificationModule, GlobalizationModule],
  providers: [...providers, ...queryHandler, ...commandHandlers, ...eventHandlers],
  exports: [...providers],
})
export class PaymentModule {
}
