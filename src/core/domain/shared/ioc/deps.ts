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
  SmsServiceService = "SmsServiceService",

  // Guards
  AppGuard = "AppGuard"
}
