import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "@/core/application/features/users";

export class LoginCommandResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;
  constructor(data?: OmitMethods<LoginCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseLoginCommandResponseDto extends WrapperResponseDto<LoginCommandResponse> {
  @ApiProperty({ type: LoginCommandResponse })
  data: LoginCommandResponse;
}

