import { User } from "@/core/domain/users";
import { LoginResponse } from "@/core/domain/auth";

export interface IAuthService {
  generateUserTokens(user: User): LoginResponse;

  createUserSession(user: User): Promise<void>;
}
