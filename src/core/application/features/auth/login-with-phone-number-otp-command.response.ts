import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { UserDto } from "@/core/application/features/users";

export class LoginWithPhoneNumberOtpCommandResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;

  constructor(data?: OmitMethods<LoginWithPhoneNumberOtpCommandResponse>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseLoginWithPhoneNumberOtpCommandResponseDto extends WrapperResponseDto<LoginWithPhoneNumberOtpCommandResponse> {
  @ApiProperty({ type: LoginWithPhoneNumberOtpCommandResponse })
  data: LoginWithPhoneNumberOtpCommandResponse;
}

