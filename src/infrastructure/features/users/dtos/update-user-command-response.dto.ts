import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserCommandResponseDto {
  constructor(data?: OmitMethods<UpdateUserCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseUpdateUserCommandResponseDto extends WrapperResponseDto<UpdateUserCommandResponseDto> {
   @ApiProperty({ type: UpdateUserCommandResponseDto })
   data: UpdateUserCommandResponseDto;
}

