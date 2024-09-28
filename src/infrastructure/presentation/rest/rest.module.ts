import { Module } from "@nestjs/common";
import { UserModule } from "@/infrastructure/features/users/user.module";
import { AuthModule } from "@/infrastructure/features/auth/auth.module";

import { PermissionModule } from "@/infrastructure/features/permissions";
import { Deps } from "@/core/domain/shared/ioc";
import { FileModule } from "@/infrastructure/features/files";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { CommuneModule } from "@/infrastructure/features/communes";
import { ReservationModule } from "@/infrastructure/features/reservations";
import { ResidenceModule } from "@/infrastructure/features/residences";
import { VilleModule } from "@/infrastructure/features/villes";
import { BienImmobilierModule } from "@/infrastructure/features/biens-immobiliers";
import { DemandeVisiteModule } from "@/infrastructure/features/demandes-visites";
import { PaymentModule } from "@/infrastructure/features/payments";
import { JwtAuthGuard, JwtStrategy } from "@/infrastructure/features/auth";

export const controllers = [];

const modules = [
  UserModule, PermissionModule, AuthModule, FileModule, NotificationModule, VilleModule,
  CommuneModule, ReservationModule, ResidenceModule, BienImmobilierModule, DemandeVisiteModule,
  PaymentModule,
];

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
