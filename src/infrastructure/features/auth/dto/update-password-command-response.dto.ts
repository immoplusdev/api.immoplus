import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordCommandResponseDto {
  constructor(data?: OmitMethods<UpdatePasswordCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseUpdatePasswordCommandResponseDto extends WrapperResponseDto<UpdatePasswordCommandResponseDto> {
   @ApiProperty({ type: UpdatePasswordCommandResponseDto })
   data: UpdatePasswordCommandResponseDto;
}

