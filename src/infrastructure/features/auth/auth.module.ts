import { forwardRef, Module, Provider } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { RegisterCommandHandler } from "@/core/application/auth/register-command.handler";
import { UserModule } from "@/infrastructure/features/users/user.module";
import {
  LoginCommandHandler,
  LoginWithEmailOtpCommandHandler,
  RefreshTokenCommandHandler,
  RegisterProEntrepriseCommandHandler,
  RegisterProParticulierCommandHandler,
  ResetPasswordCommandHandler,
  SendEmailOtpCommandHandler,
  SendSmsOtpCommandHandler,
  UpdatePasswordCommandHandler,
  VerifyEmailCommandHandler,
  VerifyPhoneNumberCommandHandler,
} from "@/core/application/auth";
import { SocialLoginCommandHandler } from "@/core/application/auth/social-login-command.handler";
import { JwtManagerService } from "./jwt-manager.service";
import { LoggingModule } from "../logging";
import { Deps } from "@/core/domain/common/ioc";
import { PasswordManagerService } from "@/infrastructure/features/auth/password-manager.service";
import { ConfigsModule } from "@/infrastructure/features/configs/configs.module";
import { TfaService } from "@/infrastructure/features/auth/tfa.service";
import { NotificationModule } from "@/infrastructure/features/notifications";
import { GlobalizationModule } from "@/infrastructure/features/globalization";
import { LoginWithPhoneNumberOtpCommandHandler } from "@/core/application/auth/login-with-phone-number-otp-command.handler";
import { SocialAuthService } from "./social-auth.service";

const commandHandlers = [
  RegisterCommandHandler,
  RegisterProEntrepriseCommandHandler,
  RegisterProParticulierCommandHandler,
  LoginCommandHandler,
  SocialLoginCommandHandler,
  RefreshTokenCommandHandler,
  UpdatePasswordCommandHandler,
  SendSmsOtpCommandHandler,
  SendEmailOtpCommandHandler,
  VerifyEmailCommandHandler,
  VerifyPhoneNumberCommandHandler,
  ResetPasswordCommandHandler,
  LoginWithPhoneNumberOtpCommandHandler,
  LoginWithEmailOtpCommandHandler,
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
  {
    provide: Deps.SocialAuthService,
    useClass: SocialAuthService,
  },
];

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => ConfigsModule),
    forwardRef(() => LoggingModule),
    GlobalizationModule,
    UserModule,
    NotificationModule,
    CqrsModule,
  ],
  providers: [...providers, ...commandHandlers, AuthService, JwtManagerService],
  exports: [...providers],
})
export class AuthModule {}
