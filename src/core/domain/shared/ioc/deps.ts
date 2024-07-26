import { ConfigsManagerService } from "@/infrastructure/features/configs/configs-manager.service";
import { UsersDataRepository } from "@/infrastructure/features/users/users-data.repository";

export enum Deps {
  DataSource = "DataSource",

  // Repositories
  UsersRepository = "UsersRepository",
  RoleRepository = "RoleRepository",
  UsersDataRepository = "UsersDataRepository",

  // Services
  LoggerService = "LoggerService",
  PasswordManagerService = "PasswordManagerService",
  JwtManagerService = "JwtManagerService",
  ConfigsManagerService = "ConfigsManagerService",
}
