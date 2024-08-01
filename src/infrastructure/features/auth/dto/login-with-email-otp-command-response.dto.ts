import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "@/infrastructure/features/users";

export class LoginWithEmailOtpCommandResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;
  constructor(data?: OmitMethods<LoginWithEmailOtpCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseLoginWithEmailOtpCommandResponseDto extends WrapperResponseDto<LoginWithEmailOtpCommandResponseDto> {
   @ApiProperty({ type: LoginWithEmailOtpCommandResponseDto })
   data: LoginWithEmailOtpCommandResponseDto;
}

