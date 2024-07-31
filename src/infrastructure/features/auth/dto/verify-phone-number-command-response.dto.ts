import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyPhoneNumberCommandResponseDto {
  constructor(data?: OmitMethods<VerifyPhoneNumberCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseVerifyPhoneNumberCommandResponseDto extends WrapperResponseDto<VerifyPhoneNumberCommandResponseDto> {
   @ApiProperty({ type: VerifyPhoneNumberCommandResponseDto })
   data: VerifyPhoneNumberCommandResponseDto;
}

