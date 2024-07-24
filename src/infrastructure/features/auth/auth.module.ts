import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterCommandHandler } from '@/core/application/features/auth/register-command.handler';
import { UsersModule } from '@/infrastructure/features/users/users.module';

const commandHandlers = [RegisterCommandHandler];

@Module({
  imports: [CqrsModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, ...commandHandlers],
})
export class AuthModule {}
