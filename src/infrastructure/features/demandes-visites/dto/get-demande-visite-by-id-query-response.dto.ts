import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";

export class GetDemandeVisiteByIdQueryResponseDto {
  constructor(data?: OmitMethods<GetDemandeVisiteByIdQueryResponseDto>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseGetDemandeVisiteByIdQueryResponseDto extends WrapperResponseDto<GetDemandeVisiteByIdQueryResponseDto> {
   @ApiProperty({ type: GetDemandeVisiteByIdQueryResponseDto })
   data: GetDemandeVisiteByIdQueryResponseDto;
}