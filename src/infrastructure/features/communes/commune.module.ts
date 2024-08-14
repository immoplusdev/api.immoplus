import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from "@/infrastructure/typeorm";
import { CommuneController } from './commune.controller';
import { CommuneRepository } from './commune.repository';

const providers: Provider[] = [
  {
    provide: Deps.CommuneRepository,
    useClass: CommuneRepository,
  },
];

@Module({
  controllers: [CommuneController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class CommuneModule {}
