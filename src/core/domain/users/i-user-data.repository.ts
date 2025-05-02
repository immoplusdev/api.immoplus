import { IBaseRepository } from '@/core/domain/common/repositories';
import { UserData } from '@/core/domain/users';

export interface IUserDataRepository extends IBaseRepository<UserData, Partial<UserData>, Partial<UserData>> {}
