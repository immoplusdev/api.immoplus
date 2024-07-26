import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { PermissionController } from './permissions.controller';
import { PermissionRepository } from './permissions.repository';
import { TypeormModule } from "@/infrastructure/typeorm";

const providers: Provider[] = [
  {
    provide: Deps.PermissionRepository,
    useClass: PermissionRepository,
  },
];

@Module({
  controllers: [PermissionController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class PermissionModule {}
