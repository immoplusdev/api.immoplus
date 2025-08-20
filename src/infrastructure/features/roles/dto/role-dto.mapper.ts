import { AutoMapper } from "@/lib/ts-utilities";
import { Role } from "@/core/domain/roles";
import { RoleDto } from "./role.dto";

export class RoleDtoMapper {
  private mapper: AutoMapper;
  constructor() {
    this.mapper = new AutoMapper();
  }

  mapFrom(object: Role): RoleDto {
    return this.mapper.execute<Role, RoleDto>(object);
  }

  mapTo(object: RoleDto): Role {
    return this.mapper.execute<RoleDto, Role>(object);
  }
}
