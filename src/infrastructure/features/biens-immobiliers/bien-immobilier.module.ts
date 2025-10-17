import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { BienImmobilierController } from "./bien-immobilier.controller";
import { BienImmobilierRepository } from "./bien-immobilier.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { GlobalizationModule } from "@/infrastructure/features/globalization";
import { UserModule } from "@/infrastructure/features/users";
import { BienImmobilierStatusValidationUpdatedEventHandler } from "@/core/application/demandes-visites";

const eventHandlers = [BienImmobilierStatusValidationUpdatedEventHandler];

const providers: Provider[] = [
  {
    provide: Deps.BiensImmobiliesRepository,
    useClass: BienImmobilierRepository,
  },
];

@Module({
  controllers: [BienImmobilierController],
  imports: [TypeormModule, CqrsModule, NotificationModule, GlobalizationModule, UserModule],
  providers: [...providers, ...eventHandlers],
  exports: [...providers],
})
export class BienImmobilierModule {}
