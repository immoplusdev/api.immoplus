import { IBaseRepository } from '@/core/domain/shared/repositories';
import { User } from '@/core/domain/users/users.model';

export interface IUsersRepository
  extends IBaseRepository<User, Partial<User>, Partial<User>> {
  findByEmail(email: string): Promise<User | null>;

  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
}
