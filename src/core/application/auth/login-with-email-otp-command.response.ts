import { ApiProperty } from "@/core/domain/common/docs";
import { UserDto } from "@/core/application/users";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";

export class LoginWithEmailOtpCommandResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;
  constructor(data?: OmitMethods<LoginWithEmailOtpCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseLoginWithEmailOtpCommandResponseDto extends WrapperResponseDto<LoginWithEmailOtpCommandResponse> {
  @ApiProperty({ type: LoginWithEmailOtpCommandResponse })
  data: LoginWithEmailOtpCommandResponse;
}
