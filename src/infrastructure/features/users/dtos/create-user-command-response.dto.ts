import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserCommandResponseDto {
  constructor(data?: OmitMethods<CreateUserCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseCreateUserCommandResponseDto extends WrapperResponseDto<CreateUserCommandResponseDto> {
   @ApiProperty({ type: CreateUserCommandResponseDto })
   data: CreateUserCommandResponseDto;
}

