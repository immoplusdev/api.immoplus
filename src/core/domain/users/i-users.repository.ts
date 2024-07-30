import { IBaseRepository } from "@/core/domain/shared/repositories";
import { User } from "@/core/domain/users/users.model";
import { UserWithRoleAndPermissions } from "@/core/domain/users/user-with-role-and-permissions.model";

export interface IUsersRepository
  extends IBaseRepository<User, Partial<User>, Partial<User>, string> {
  findByEmail(email: string, fields?: string[]): Promise<User | null>;

  findByPhoneNumber(phoneNumber: string, fields?: string[]): Promise<User | null>;

  findByUsername(username: string, fields?: string[]): Promise<User | null>;

  findByIdWithRoleAndPermissions(id: string, fields?: string[]): Promise<UserWithRoleAndPermissions | null>;
}
