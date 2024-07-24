import { Module } from '@nestjs/common';
import { UsersModule } from '@/infrastructure/features/users/users.module';
import { AuthModule } from '@/infrastructure/features/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';

export const controllers = [];

const modules = [UsersModule, AuthModule];

@Module({
  providers: [
    ...controllers,
    // JwtStrategy,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: JwtAuthGuard,
    // },
  ],
  // controllers: [...controllers],
  exports: [...modules],
  imports: [...modules],
})
export class RestModule {}
