import { Module, Provider } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeormModule } from '@/infrastructure/configs/typeorm/typeorm.module';
import { Deps } from '@/core/domain/shared/ioc';
import { UsersRepository } from './users.repository';

const providers: Provider[] = [
  {
    provide: Deps.UsersRepository,
    useClass: UsersRepository,
  },
];

@Module({
  controllers: [UsersController],
  imports: [TypeormModule],
  providers: [...providers],
  exports: [...providers],
})
export class UsersModule {}
