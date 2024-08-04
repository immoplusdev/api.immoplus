import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { ResidenceRepository } from "./residences.repository";
import { ResidenceController } from "@/infrastructure/features/residences/residences.controller";

const queryHandler = [];
const commandHandlers = [];

const providers: Provider[] = [
  {
    provide: Deps.ResidenceRepository,
    useClass: ResidenceRepository,
  },
];

@Module({
  controllers: [ResidenceController],
  imports: [TypeormModule],
  providers: [...providers, ...queryHandler, ...commandHandlers],
  exports: [...providers],
})
export class ResidenceModule {}
