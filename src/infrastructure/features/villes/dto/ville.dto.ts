import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";

export class VilleDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
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
  constructor(data?: OmitMethods<VilleDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseVilleDto extends WrapperResponseDto<VilleDto> {
   @ApiProperty({ type: VilleDto })
   data: VilleDto;
}

export class WrapperResponseVilleListDto extends WrapperResponseDto<VilleDto[]> {
   @ApiProperty({ type: [VilleDto] })
   data: VilleDto[];
}

