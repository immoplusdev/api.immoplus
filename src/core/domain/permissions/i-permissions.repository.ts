import { IBaseRepository } from '@/core/domain/shared/repositories';
import { Permission } from '@/core/domain/permissions';


export interface IPermissionRepository extends IBaseRepository<Permission, Partial<Permission>, Partial<Permission>> {
  findByRoleId(roleId: string): Promise<Permission[]>;
}
