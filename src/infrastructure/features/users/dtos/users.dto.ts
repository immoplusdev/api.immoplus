import { UserStatus } from '@/core/domain/users/user-status.enum';
import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from '@nestjs/swagger';
import { WrapperResponseDto } from "@/lib/responses";

export class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  language?: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  verificationCode?: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  otp?: string;
  @ApiProperty()
  country?: string;
  @ApiProperty()
  state?: string;
  @ApiProperty()
  city?: string;
  @ApiProperty()
  commune?: string;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  address2?: string;
  @ApiProperty()
  emailVerified: boolean;
  @ApiProperty()
  phoneNumberVerified: boolean;
  @ApiProperty()
  currency?: string;
  @ApiProperty()
  authLoginAttempts: number;
  @ApiProperty()
  status: UserStatus;

  constructor(data?: OmitMethods<UserDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseUserDto extends WrapperResponseDto<UserDto> {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class WrapperResponseUserListDto extends WrapperResponseDto<UserDto[]> {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}
