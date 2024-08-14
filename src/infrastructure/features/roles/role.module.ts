import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { TypeormModule } from '@/infrastructure/typeorm';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';

const providers: Provider[] = [
  {
    provide: Deps.RoleRepository,
    useClass: RoleRepository,
  },
];

@Module({
  controllers: [RoleController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class RoleModule {}
