import { IBaseRepository } from "@/core/domain/shared/repositories";
import { User } from "@/core/domain/users/user.model";
import { UserWithRoleAndPermissions } from "@/core/domain/users/user-with-role-and-permissions.model";
import { PublicUserInfo } from "@/core/domain/users/public-user-info.model";
import { FindItemOptions } from "@/core/domain/shared/models";

export interface IUserRepository
  extends IBaseRepository<User, Partial<User>, Partial<User>, string> {
  findOneByEmail(email: string, options?: FindItemOptions): Promise<User | null>;

  findOneByPhoneNumber(phoneNumber: string, options?: FindItemOptions): Promise<User | null>;

  findOneByUsername(username: string, options?: FindItemOptions): Promise<User | null>;

  findOneByIdWithRoleAndPermissions(id: string, options?: FindItemOptions): Promise<UserWithRoleAndPermissions | null>;

  findPublicUserInfoByUserId(id: string): Promise<PublicUserInfo | null>;
}
