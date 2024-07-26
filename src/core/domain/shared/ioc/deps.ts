import { ConfigsManagerService } from "@/infrastructure/features/configs/configs-manager.service";

export enum Deps {
  DataSource = "DataSource",

  // Repositories
  UsersRepository = "UsersRepository",
  RoleRepository = "RoleRepository",

  // Services
  LoggerService = "LoggerService",
  PasswordManagerService = "PasswordManagerService",
  JwtManagerService = "JwtManagerService",
  ConfigsManagerService = "ConfigsManagerService",
}
