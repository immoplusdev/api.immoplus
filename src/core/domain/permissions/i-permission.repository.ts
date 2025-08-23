import { IBaseRepository } from "@/core/domain/common/repositories";
import { Permission } from "@/core/domain/permissions";
import { WrapperResponse } from "@/core/domain/common/models";

export interface IPermissionRepository
  extends IBaseRepository<
    Permission,
    Partial<Permission>,
    Partial<Permission>
  > {
  findByRoleId(roleId: string): Promise<WrapperResponse<Permission[]>>;
}
