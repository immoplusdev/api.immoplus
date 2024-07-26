import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";


export class RoleDto {
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

