import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDemandeVisiteCommandResponseDto {
  constructor(data?: OmitMethods<CreateDemandeVisiteCommandResponseDto>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseCreateDemandeVisiteCommandResponseDto extends WrapperResponseDto<CreateDemandeVisiteCommandResponseDto> {
   @ApiProperty({ type: CreateDemandeVisiteCommandResponseDto })
   data: CreateDemandeVisiteCommandResponseDto;
}

