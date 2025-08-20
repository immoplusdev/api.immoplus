import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { DemandeVisiteController } from "./demande-visite.controller";
import { DemandeVisiteRepository } from "./demande-visite.repository";
import { CqrsModule } from "@nestjs/cqrs";
import {
  AnnulerDemandeVisiteByIdCommandHandler,
  CreateDemandeVisiteCommandHandler,
  EstimerPrixDemandeVisiteQueryHandler,
  GetBienImmobilierOccupiedDateQueryHandler,
  GetDemandeVisiteByIdQueryHandler,
  ProgrammerDemandeVisiteCommandHandler,
} from "@/core/application/demandes-visites";
import { ConfigsModule } from "@/infrastructure/features/configs";
import { BienImmobilierModule } from "@/infrastructure/features/biens-immobiliers";
import { UserModule } from "@/infrastructure/features/users";
import { GlobalizationModule } from "@/infrastructure/features/globalization";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { LoggingModule } from "@/infrastructure/features/logging";
import { DemandesVisiteService } from "@/infrastructure/features/demandes-visites/demandes-visite.service";

const commandHandlers = [
  CreateDemandeVisiteCommandHandler,
  AnnulerDemandeVisiteByIdCommandHandler,
  ProgrammerDemandeVisiteCommandHandler,
];
const queryHandler = [
  EstimerPrixDemandeVisiteQueryHandler,
  GetBienImmobilierOccupiedDateQueryHandler,
  GetDemandeVisiteByIdQueryHandler,
];
const providers: Provider[] = [
  {
    provide: Deps.DemandeVisiteRepository,
    useClass: DemandeVisiteRepository,
  },
  {
    provide: Deps.DemandesVisiteService,
    useClass: DemandesVisiteService,
  },
];

@Module({
  controllers: [DemandeVisiteController],
  imports: [
    TypeormModule,
    CqrsModule,
    ConfigsModule,
    BienImmobilierModule,
    UserModule,
    GlobalizationModule,
    NotificationModule,
    LoggingModule,
  ],
  providers: [...providers, ...queryHandler, ...commandHandlers],
  exports: [...providers],
})
export class DemandeVisiteModule {}
