import { IBaseRepository } from "@/core/domain/common/repositories";
import { Role } from "@/core/domain/roles";

export interface IRoleRepository
  extends IBaseRepository<Role, Partial<Role>, Partial<Role>> {}
