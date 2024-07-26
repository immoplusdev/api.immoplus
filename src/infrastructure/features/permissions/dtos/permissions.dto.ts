import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { Role } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";

export class PermissionDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  role: Role | string;
  @ApiProperty()
  collectionName: PermissionCollection;
  @ApiProperty()
  action: PermissionAction;
  @ApiProperty()
  fields?: string[];
  constructor(data?: OmitMethods<PermissionDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponsePermissionDto extends WrapperResponseDto<PermissionDto> {
   @ApiProperty({ type: PermissionDto })
   data: PermissionDto;
}

export class WrapperResponsePermissionListDto extends WrapperResponseDto<PermissionDto[]> {
   @ApiProperty({ type: [PermissionDto] })
   data: PermissionDto[];
}

