import { IBaseRepository } from "@/core/domain/shared/repositories";
import { User } from "@/core/domain/users/users.model";
import { UserWithRoleAndPermissions } from "@/core/domain/users/user-with-role-and-permissions.model";
import { PublicUserInfo } from "@/core/domain/users/public-user-info.model";

export interface IUsersRepository
  extends IBaseRepository<User, Partial<User>, Partial<User>, string> {
  findOneByEmail(email: string, fields?: string[]): Promise<User | null>;

  findOneByPhoneNumber(phoneNumber: string, fields?: string[]): Promise<User | null>;

  findOneByUsername(username: string, fields?: string[]): Promise<User | null>;

  findOneByIdWithRoleAndPermissions(id: string, fields?: string[]): Promise<UserWithRoleAndPermissions | null>;

  findPublicUserInfoByUserId(id: string): Promise<PublicUserInfo | null>;
}
