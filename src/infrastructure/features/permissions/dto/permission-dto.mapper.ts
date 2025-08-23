import { AutoMapper, IMapper } from "@/lib/ts-utilities";
import { Permission } from "@/core/domain/permissions";
import { PermissionDto } from "./permission.dto";

export class PermissionDtoMapper {
  private mapper: AutoMapper;
  constructor() {
    this.mapper = new AutoMapper();
  }

  mapFrom(object: Permission): PermissionDto {
    return this.mapper.execute<Permission, PermissionDto>(object);
  }

  mapTo(object: PermissionDto): Permission {
    return this.mapper.execute<PermissionDto, Permission>(object);
  }
}
