import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/infrastructure/features/users';

export class RegisterCommandResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expires: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;

  constructor(data?: OmitMethods<RegisterCommandResponseDto>) {
    if (data) Object.assign(this, data);
  }
}


export class WrapperResponseRegisterCommandResponseDto {
  @ApiProperty({ type: RegisterCommandResponseDto })
  data: RegisterCommandResponseDto;
}