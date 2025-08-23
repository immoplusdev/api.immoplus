import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { ResidenceRepository } from "./residence.repository";
import { ResidenceController } from "@/infrastructure/features/residences/residence.controller";
import {
  ResidenceStatusUpdatedEventHandler,
  UpdateResidenceByIdCommandHandler,
} from "@/core/application/residences";
import { CqrsModule } from "@nestjs/cqrs";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { GlobalizationModule } from "@/infrastructure/features/globalization";

const queryHandler = [];
const commandHandlers = [UpdateResidenceByIdCommandHandler];
const eventHandlers = [ResidenceStatusUpdatedEventHandler];

const providers: Provider[] = [
  {
    provide: Deps.ResidenceRepository,
    useClass: ResidenceRepository,
  },
];

@Module({
  controllers: [ResidenceController],
  imports: [TypeormModule, CqrsModule, GlobalizationModule, NotificationModule],
  providers: [
    ...providers,
    ...queryHandler,
    ...commandHandlers,
    ...eventHandlers,
  ],
  exports: [...providers],
})
export class ResidenceModule {}
