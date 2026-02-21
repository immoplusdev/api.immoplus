import { FindItemOptions } from "@/core/domain/common/models";
import { IBaseRepository } from "@/core/domain/common/repositories";
import { User } from "./user.model";
import { PublicUserInfo } from "./public-user-info.model";
import { UserWithRoleAndPermissions } from "./user-with-role-and-permissions.model";

export interface IUserRepository extends IBaseRepository<
  User,
  Partial<User>,
  Partial<User>,
  string
> {
  findOneByEmail(
    email: string,
    options?: FindItemOptions,
  ): Promise<User | null>;

  findOneByPhoneNumber(
    phoneNumber: string,
    options?: FindItemOptions,
  ): Promise<User | null>;

  findOneByUsername(
    username: string,
    options?: FindItemOptions,
  ): Promise<User | null>;

  findOneByIdWithRoleAndPermissions(
    id: string,
    options?: FindItemOptions,
  ): Promise<UserWithRoleAndPermissions | null>;

  findPublicUserInfoByUserId(id: string): Promise<PublicUserInfo | null>;

  findClientByPhoneNumber(phoneNumber: string): Promise<PublicUserInfo | null>;

  findAdminUsers(): Promise<User[]>;

  findOneByGoogleId(
    googleId: string,
    options?: FindItemOptions,
  ): Promise<User | null>;

  findOneByFacebookId(
    facebookId: string,
    options?: FindItemOptions,
  ): Promise<User | null>;

  findOneByAppleId(
    appleId: string,
    options?: FindItemOptions,
  ): Promise<User | null>;
}
