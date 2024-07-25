import { Module, Provider } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { RegisterCommandHandler } from "@/core/application/features/auth/register-command.handler";
import { UsersModule } from "@/infrastructure/features/users/users.module";
import {
  LoginCommandHandler,
  LoginWithPhoneNumberCommandHandler,
} from "@/core/application/features/auth";
import { JwtManagerService } from "@/infrastructure/features/auth/jwt-manager.service";
import { LoggingModule } from "@/infrastructure/features/logging";
import { Deps } from "@/core/domain/shared/ioc";
import { PasswordManagerService } from "@/infrastructure/features/auth/password-manager.service";
import { ConfigsModule } from "@/infrastructure/features/configs/configs.module";

const commandHandlers = [RegisterCommandHandler, LoginCommandHandler, LoginWithPhoneNumberCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.PasswordManagerService,
    useClass: PasswordManagerService,
  },
  {
    provide: Deps.JwtManagerService,
    useClass: JwtManagerService,
  },
];


@Module({
  imports: [CqrsModule, ConfigsModule, LoggingModule, UsersModule],
  controllers: [AuthController],
  providers: [...providers, ...commandHandlers, AuthService, JwtManagerService],
  exports: [...providers],
})
export class AuthModule {
}
