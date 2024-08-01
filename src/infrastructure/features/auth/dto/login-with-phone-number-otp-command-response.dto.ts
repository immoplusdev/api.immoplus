import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { UserDto } from "@/infrastructure/features/users";

export class LoginWithPhoneNumberOtpCommandResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;

  constructor(data?: OmitMethods<LoginWithPhoneNumberOtpCommandResponseDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseLoginWithPhoneNumberOtpCommandResponseDto extends WrapperResponseDto<LoginWithPhoneNumberOtpCommandResponseDto> {
  @ApiProperty({ type: LoginWithPhoneNumberOtpCommandResponseDto })
  data: LoginWithPhoneNumberOtpCommandResponseDto;
}

