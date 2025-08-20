import { Module, Provider } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { VilleController } from "./ville.controller";
import { VilleRepository } from "./ville.repository";

const providers: Provider[] = [
  {
    provide: Deps.VilleRepository,
    useClass: VilleRepository,
  },
];

@Module({
  controllers: [VilleController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class VilleModule {}
