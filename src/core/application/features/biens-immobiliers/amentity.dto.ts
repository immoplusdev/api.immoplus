import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";

export class AmentityDto {
  constructor(data?: OmitMethods<AmentityDto>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseAmentityDto extends WrapperResponseDto<AmentityDto> {
   @ApiProperty({ type: AmentityDto })
   data: AmentityDto;
}

export class WrapperResponseAmentityListDto extends WrapperResponseDto<AmentityDto[]> {
   @ApiProperty({ type: [AmentityDto] })
   data: AmentityDto[];
   @ApiProperty()
   currentPage: number;
   @ApiProperty()
   totalPages: number;
   @ApiProperty()
   pageSize: number;
   @ApiProperty()
   totalCount: number;
   @ApiProperty()
   hasPrevious: boolean;
   @ApiProperty()
   hasNext: boolean;
}

