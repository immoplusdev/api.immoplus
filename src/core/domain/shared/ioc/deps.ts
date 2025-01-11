import { DemandesVisiteService } from "@/infrastructure/features/demandes-visites/demandes-visite.service";

export enum Deps {
  DataSource = "DataSource",

  // Repositories
  UsersRepository = "UsersRepository",
  RoleRepository = "RoleRepository",
  PermissionRepository = "PermissionRepository",
  UsersDataRepository = "UsersDataRepository",
  FileRepository = "FileRepository",
  NotificationRepository = "NotificationRepository",
  VilleRepository = "VilleRepository",
  CommuneRepository = "CommuneRepository",
  ReservationRepository = "ReservationRepository",
  AppConfigsRepository = "AppConfigsRepository",
  ResidenceRepository = "ResidenceRepository",
  BiensImmobiliesRepository = "BiensImmobiliesRepository",
  DemandeVisiteRepository = "DemandeVisiteRepository",
  PaymentRepository = "PaymentRepository",

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
  PaymentGatewayService = "PaymentGatewayService",
  NotificationService = "NotificationService",
  ReservationService = "ReservationService",
  DemandesVisiteService = "DemandesVisiteService",

  // Guards

  AppGuard = "AppGuard"
}
