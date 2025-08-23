import { Module, Provider } from "@nestjs/common";
import { TransfersController } from "./transfers.controller";
import { TransfersService } from "./transfers.service";
import { Deps } from "@/core/domain/common/ioc";
import { TransfersRepository } from "./transfers.repositotry";
import { TypeormModule } from "@/infrastructure/typeorm";
import { CqrsModule } from "@nestjs/cqrs";

const providers: Provider[] = [
  {
    provide: Deps.TransferRepository,
    useClass: TransfersRepository,
  },
  {
    provide: Deps.TransfertService,
    useClass: TransfersService,
  },
];
@Module({
  imports: [TypeormModule, CqrsModule],
  controllers: [TransfersController],
  providers: [...providers],
  exports: [...providers],
})
export class TransfersModule {}
