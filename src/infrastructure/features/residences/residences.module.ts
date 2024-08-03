import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { ResidenceController } from './residences.controller';
import { ResidenceRepository } from './residences.repository';

const providers: Provider[] = [
  {
    provide: Deps.ResidenceRepository,
    useClass: ResidenceRepository,
  },
];

@Module({
  controllers: [ResidenceController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class ResidenceModule {}
