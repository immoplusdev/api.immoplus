import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { DemandeVisiteController } from './demande-visite.controller';
import { DemandeVisiteRepository } from './demande-visite.repository';

const providers: Provider[] = [
  {
    provide: Deps.DemandeVisiteRepository,
    useClass: DemandeVisiteRepository,
  },
];

@Module({
  controllers: [DemandeVisiteController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class DemandeVisiteModule {}
