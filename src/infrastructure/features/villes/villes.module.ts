import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { VilleController } from './villes.controller';
import { VilleRepository } from './villes.repository';

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
