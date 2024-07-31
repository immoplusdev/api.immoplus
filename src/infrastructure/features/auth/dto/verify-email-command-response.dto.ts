import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailCommandResponseDto {
  constructor(data?: OmitMethods<VerifyEmailCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseVerifyEmailCommandResponseDto extends WrapperResponseDto<VerifyEmailCommandResponseDto> {
   @ApiProperty({ type: VerifyEmailCommandResponseDto })
   data: VerifyEmailCommandResponseDto;
}

