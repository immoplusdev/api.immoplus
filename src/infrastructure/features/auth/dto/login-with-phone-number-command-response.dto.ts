import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class LoginWithPhoneNumberCommandResponseDto {
  constructor(data?: OmitMethods<LoginWithPhoneNumberCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseLoginWithPhoneNumberCommandResponseDto extends WrapperResponseDto<LoginWithPhoneNumberCommandResponseDto> {
   @ApiProperty({ type: LoginWithPhoneNumberCommandResponseDto })
   data: LoginWithPhoneNumberCommandResponseDto;
}

