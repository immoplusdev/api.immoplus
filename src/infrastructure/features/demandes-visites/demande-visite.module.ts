import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { DemandeVisiteController } from "./demande-visite.controller";
import { DemandeVisiteRepository } from "./demande-visite.repository";
import { CqrsModule } from "@nestjs/cqrs";
import {
  AnnulerDemandeVisiteByIdCommandHandler,
  CreateDemandeVisiteCommandHandler,
  EstimerPrixDemandeVisiteQueryHandler,
  GetBienImmobilierOccupiedDateQueryHandler, GetDemandeVisiteByIdQueryHandler, ProgrammerDemandeVisiteCommandHandler,
} from "@/core/application/features/demandes-visites";
import { ConfigsModule } from "@/infrastructure/features/configs";
import { BienImmobilierModule } from "@/infrastructure/features/biens-immobiliers";
import { UserModule } from "@/infrastructure/features/users";

const commandHandlers = [CreateDemandeVisiteCommandHandler, AnnulerDemandeVisiteByIdCommandHandler, ProgrammerDemandeVisiteCommandHandler];
const queryHandler = [EstimerPrixDemandeVisiteQueryHandler, GetBienImmobilierOccupiedDateQueryHandler, GetDemandeVisiteByIdQueryHandler];
const providers: Provider[] = [
  {
    provide: Deps.DemandeVisiteRepository,
    useClass: DemandeVisiteRepository,
  },
];

@Module({
  controllers: [DemandeVisiteController],
  imports: [TypeormModule, CqrsModule, ConfigsModule, BienImmobilierModule, UserModule],
  providers: [...providers, ...queryHandler, ...commandHandlers],
  exports: [...providers],
})
export class DemandeVisiteModule {
}
