import { Module, Provider, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeormModule } from "@/infrastructure/typeorm/typeorm.module";
import { Deps } from "@/core/domain/common/ioc";
import { UserRepository } from "./user.repository";
import { UserDataRepository } from "@/infrastructure/features/users/user-data.repository";
import { PermissionModule } from "@/infrastructure/features/permissions";
import { RoleModule } from "@/infrastructure/features/roles";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { CqrsModule } from "@nestjs/cqrs";
import { UpdateUserAdditionalDataCommandHandler } from "@/core/application/users";
import { UserOtpService } from "./user-otp.service";
import { UserOtpRepository } from "./user-otp.repository";

const commandHandlers = [UpdateUserAdditionalDataCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.UsersRepository,
    useClass: UserRepository,
  },
  {
    provide: Deps.UsersDataRepository,
    useClass: UserDataRepository,
  },
  UserOtpService,
  UserOtpRepository,
];

@Module({
  controllers: [UserController],
  imports: [
    CqrsModule,
    TypeormModule,
    PermissionModule,
    RoleModule,
    NotificationModule,
  ],
  providers: [...providers, ...commandHandlers],
  exports: [...providers],
})
export class UserModule {}
