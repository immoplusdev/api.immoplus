import { FindItemOptions } from "@/core/domain/shared/models";
import { IBaseRepository } from "@/core/domain/shared/repositories";
import { User } from "./user.model";
import { PublicUserInfo } from "./public-user-info.model";
import { UserWithRoleAndPermissions } from "./user-with-role-and-permissions.model";


export interface IUserRepository
  extends IBaseRepository<User, Partial<User>, Partial<User>, string> {

  findOneByEmail(email: string, options?: FindItemOptions): Promise<User | null>;

  findOneByPhoneNumber(phoneNumber: string, options?: FindItemOptions): Promise<User | null>;

  findOneByUsername(username: string, options?: FindItemOptions): Promise<User | null>;

  findOneByIdWithRoleAndPermissions(id: string, options?: FindItemOptions): Promise<UserWithRoleAndPermissions | null>;

  findPublicUserInfoByUserId(id: string): Promise<PublicUserInfo | null>;
}
