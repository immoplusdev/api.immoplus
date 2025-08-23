import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";

export class CommuneDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  ville: string;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;

  constructor(data?: OmitMethods<CommuneDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseCommuneDto extends WrapperResponseDto<CommuneDto> {
  @ApiProperty({ type: CommuneDto })
  data: CommuneDto;
}

export class WrapperResponseCommuneListDto extends WrapperResponseDto<
  CommuneDto[]
> {
  @ApiProperty({ type: [CommuneDto] })
  data: CommuneDto[];
}
