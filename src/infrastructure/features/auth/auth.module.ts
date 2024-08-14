import { Module, Provider } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { RegisterCommandHandler } from "@/core/application/features/auth/register-command.handler";
import { UserModule } from "@/infrastructure/features/users/user.module";
import {
  LoginCommandHandler, LoginWithEmailOtpCommandHandler,
  RegisterProEntrepriseCommandHandler,
  RegisterProParticulierCommandHandler,
  ResetPasswordCommandHandler,
  SendEmailOtpCommandHandler,
  SendSmsOtpCommandHandler,
  UpdatePasswordCommandHandler,
  VerifyEmailCommandHandler,
  VerifyPhoneNumberCommandHandler,
} from "@/core/application/features/auth";
import { JwtManagerService } from "@/infrastructure/features/auth/jwt-manager.service";
import { LoggingModule } from "@/infrastructure/features/logging";
import { Deps } from "@/core/domain/shared/ioc";
import { PasswordManagerService } from "@/infrastructure/features/auth/password-manager.service";
import { ConfigsModule } from "@/infrastructure/features/configs/configs.module";
import { TfaService } from "@/infrastructure/features/auth/tfa.service";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { GlobalizationModule } from "@/infrastructure/features/globalization";
import {
  LoginWithPhoneNumberOtpCommandHandler,
} from "@/core/application/features/auth/login-with-phone-number-otp-command.handler";

const commandHandlers = [
  RegisterCommandHandler, RegisterProEntrepriseCommandHandler,
  RegisterProParticulierCommandHandler, LoginCommandHandler,
  UpdatePasswordCommandHandler,
  SendSmsOtpCommandHandler, SendEmailOtpCommandHandler,
  VerifyEmailCommandHandler, VerifyPhoneNumberCommandHandler,
  ResetPasswordCommandHandler, LoginWithPhoneNumberOtpCommandHandler,
  LoginWithEmailOtpCommandHandler
];

const providers: Provider[] = [
  {
    provide: Deps.PasswordManagerService,
    useClass: PasswordManagerService,
  },
  {
    provide: Deps.JwtManagerService,
    useClass: JwtManagerService,
  },
  {
    provide: Deps.TfaService,
    useClass: TfaService,
  },
  {
    provide: Deps.AuthService,
    useClass: AuthService,
  },
];


@Module({
  controllers: [AuthController],
  imports: [CqrsModule, ConfigsModule, GlobalizationModule, LoggingModule, UserModule, NotificationModule],
  providers: [...providers, ...commandHandlers, AuthService, JwtManagerService],
  exports: [...providers],
})
export class AuthModule {
}
