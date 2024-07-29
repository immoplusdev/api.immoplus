import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "@/infrastructure/features/users";

export class RegisterProParticulierCommandResponseDto {
  user: UserDto;
  constructor(data?: OmitMethods<RegisterProParticulierCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseRegisterProParticulierCommandResponseDto extends WrapperResponseDto<RegisterProParticulierCommandResponseDto> {
   @ApiProperty({ type: RegisterProParticulierCommandResponseDto })
   data: RegisterProParticulierCommandResponseDto;
}

