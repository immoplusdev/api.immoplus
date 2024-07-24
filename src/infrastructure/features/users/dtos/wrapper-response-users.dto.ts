import { WrapperResponseDto } from '@/lib/responses';
import { UserDto } from '@/infrastructure/features/users';
import { ApiProperty } from '@nestjs/swagger';

export class WrapperResponseUserDto extends WrapperResponseDto<UserDto> {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class WrapperResponseUsersDto extends WrapperResponseDto<UserDto[]> {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}