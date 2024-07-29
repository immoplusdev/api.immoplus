import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";


export class RoleDto {
  @ApiProperty()
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
  constructor(data?: OmitMethods<RoleDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseRoleDto extends WrapperResponseDto<RoleDto> {
   @ApiProperty({ type: RoleDto })
   data: RoleDto;
}

export class WrapperResponseRoleListDto extends WrapperResponseDto<RoleDto[]> {
   @ApiProperty({ type: [RoleDto] })
   data: RoleDto[];
}

