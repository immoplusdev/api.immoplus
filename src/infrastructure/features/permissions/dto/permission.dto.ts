import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { Role } from "@/core/domain/roles";
import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";

export class PermissionDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  role: Role | string;
  @ApiProperty({ enum: PermissionCollection, enumName: "PermissionCollection" })
  collectionName: PermissionCollection;
  @ApiProperty({ enum: PermissionAction, enumName: "PermissionAction" })
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

export class WrapperResponsePermissionListDto extends WrapperResponseDto<
  PermissionDto[]
> {
  @ApiProperty({ type: [PermissionDto] })
  data: PermissionDto[];
}
