import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "@/infrastructure/features/users";

export class LoginCommandResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;
  constructor(data?: OmitMethods<LoginCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseLoginCommandResponseDto extends WrapperResponseDto<LoginCommandResponseDto> {
   @ApiProperty({ type: LoginCommandResponseDto })
   data: LoginCommandResponseDto;
}

