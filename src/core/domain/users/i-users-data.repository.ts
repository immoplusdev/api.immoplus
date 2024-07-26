import { IBaseRepository } from '@/core/domain/shared/repositories';
import { UserData } from '@/core/domain/users';


export interface IUsersDataRepository extends IBaseRepository<UserData, Partial<UserData>, Partial<UserData>> {}
