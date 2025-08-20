import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { UserRole } from "@/core/domain/roles";

export class RoleDto {
  @ApiProperty({ enum: UserRole, enumName: "UserRole" })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  icon?: string;
  @ApiProperty()
  enforceTfa: boolean;
  @ApiProperty()
  appAccess: boolean;
  @ApiProperty()
  adminAccess: boolean;

  hasAdminAccess() {
    return this.adminAccess;
  }

  constructor(data?: OmitMethods<RoleDto>) {
    Object.assign(this, data);
    this.adminAccess = this.id == UserRole.Admin;
  }
}
