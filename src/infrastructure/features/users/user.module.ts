import { Module, Provider } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeormModule } from '@/infrastructure/typeorm/typeorm.module';
import { Deps } from '@/core/domain/shared/ioc';
import { UserRepository } from './user.repository';
import { UserDataRepository } from "@/infrastructure/features/users/user-data.repository";
import { PermissionModule } from "@/infrastructure/features/permissions";
import { RoleModule } from "@/infrastructure/features/roles";
import { CqrsModule } from "@nestjs/cqrs";
import { UpdateUserAdditionalDataCommandHandler } from "@/core/application/features/users";

const commandHandlers = [UpdateUserAdditionalDataCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.UsersRepository,
    useClass: UserRepository,
  }, {
    provide: Deps.UsersDataRepository,
    useClass: UserDataRepository,
  },
];

@Module({
  controllers: [UserController],
  imports: [CqrsModule, TypeormModule, PermissionModule, RoleModule],
  providers: [...providers, ...commandHandlers],
  exports: [...providers],
})
export class UserModule {}
