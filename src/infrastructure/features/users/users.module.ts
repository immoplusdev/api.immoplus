import { Module, Provider } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeormModule } from '@/infrastructure/typeorm/typeorm.module';
import { Deps } from '@/core/domain/shared/ioc';
import { UsersRepository } from './users.repository';
import { UsersDataRepository } from "@/infrastructure/features/users/users-data.repository";
import { PermissionModule } from "@/infrastructure/features/permissions";
import { RoleModule } from "@/infrastructure/features/roles";
import { CqrsModule } from "@nestjs/cqrs";
import { UpdateUserAdditionalDataCommandHandler } from "@/core/application/features/users";

const commandHandlers = [UpdateUserAdditionalDataCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.UsersRepository,
    useClass: UsersRepository,
  }, {
    provide: Deps.UsersDataRepository,
    useClass: UsersDataRepository,
  },
];

@Module({
  controllers: [UsersController],
  imports: [CqrsModule, TypeormModule, PermissionModule, RoleModule],
  providers: [...providers, ...commandHandlers],
  exports: [...providers],
})
export class UsersModule {}
