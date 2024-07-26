import { Module, Provider } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeormModule } from '@/infrastructure/typeorm/typeorm.module';
import { Deps } from '@/core/domain/shared/ioc';
import { UsersRepository } from './users.repository';
import { UsersDataRepository } from "@/infrastructure/features/users/users-data.repository";

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
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class UsersModule {}
