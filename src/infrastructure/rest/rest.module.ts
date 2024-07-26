import { Module } from '@nestjs/common';
import { UsersModule } from '@/infrastructure/features/users/users.module';
import { AuthModule } from '@/infrastructure/features/auth/auth.module';
import { JwtAuthGuard, JwtStrategy } from "@/infrastructure/auth";
import { PermissionModule } from "@/infrastructure/features/permissions";
import { Deps } from "@/core/domain/shared/ioc";
import { FileModule } from "@/infrastructure/features/files";

export const controllers = [];

const modules = [UsersModule, PermissionModule, AuthModule, FileModule];

@Module({
  providers: [
    ...controllers,
    JwtStrategy,
    {
      provide: Deps.AppGuard,
      useClass: JwtAuthGuard,
    },
  ],
  // controllers: [...controllers],
  exports: [...modules],
  imports: [...modules],
})
export class RestModule {}
