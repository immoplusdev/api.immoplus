import { IBaseRepository } from "@/core/domain/shared/repositories";
import { User } from "@/core/domain/users/users.model";
import { UserWithRoleData } from "@/core/domain/users/user-with-role-data.model";

export interface IUsersRepository
  extends IBaseRepository<User, Partial<User>, Partial<User>> {
  findByEmail(email: string): Promise<User | null>;

  findByPhoneNumber(phoneNumber: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  findByIdWithRoleData(id: string): Promise<UserWithRoleData | null>;
}
