import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordCommandResponseDto {
  constructor(data?: OmitMethods<ResetPasswordCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseResetPasswordCommandResponseDto extends WrapperResponseDto<ResetPasswordCommandResponseDto> {
   @ApiProperty({ type: ResetPasswordCommandResponseDto })
   data: ResetPasswordCommandResponseDto;
}

