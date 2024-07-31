import { MailService } from "@/infrastructure/features/notifications";
import { TfaService } from "@/infrastructure/features/auth/tfa.service";
import { AuthService } from "@/infrastructure/features/auth/auth.service";
import { GlobalizationService } from "@/infrastructure/features/globalization";

export enum Deps {
  DataSource = "DataSource",

  // Repositories
  UsersRepository = "UsersRepository",
  RoleRepository = "RoleRepository",
  PermissionRepository = "PermissionRepository",
  UsersDataRepository = "UsersDataRepository",
  FileRepository = "FileRepository",
  NotificationRepository = "NotificationRepository",


  // Services
  LoggerService = "LoggerService",
  PasswordManagerService = "PasswordManagerService",
  JwtManagerService = "JwtManagerService",
  ConfigsManagerService = "ConfigsManagerService",
  SmsService = "SmsService",
  MailService = "MailService",
  TfaService = "TfaService",
  AuthService = "AuthService",
  GlobalizationService = "GlobalizationService",

  // Guards
  AppGuard = "AppGuard"
}
