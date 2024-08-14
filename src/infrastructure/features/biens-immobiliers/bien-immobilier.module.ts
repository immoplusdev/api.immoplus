import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { BienImmobilierController } from './bien-immobilier.controller';
import { BienImmobilierRepository } from './bien-immobilier.repository';

const providers: Provider[] = [
  {
    provide: Deps.BiensImmobiliesRepository,
    useClass: BienImmobilierRepository,
  },
];

@Module({
  controllers: [BienImmobilierController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class BienImmobilierModule {}
