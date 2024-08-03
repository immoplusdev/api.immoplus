import { Module } from '@nestjs/common';
import { UsersModule } from '@/infrastructure/features/users/users.module';
import { AuthModule } from '@/infrastructure/features/auth/auth.module';
import { JwtAuthGuard, JwtStrategy } from "@/infrastructure/auth";
import { PermissionModule } from "@/infrastructure/features/permissions";
import { Deps } from "@/core/domain/shared/ioc";
import { FileModule } from "@/infrastructure/features/files";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { CommuneModule } from "@/infrastructure/features/communes";
import { ReservationModule } from "@/infrastructure/features/reservations";
import { ResidenceModule } from "@/infrastructure/features/residences";
import { VilleModule } from "@/infrastructure/features/villes";

export const controllers = [];

const modules = [UsersModule, PermissionModule, AuthModule, FileModule, NotificationModule, VilleModule, CommuneModule, ReservationModule, ResidenceModule];

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
