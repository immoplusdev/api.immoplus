import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "@/core/application/features/users";

export class RegisterCommandResponse {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  constructor(data?: OmitMethods<RegisterCommandResponse>) {
    if (data) Object.assign(this, data);
  }
}


export class WrapperResponseRegisterCommandResponseDto {
  @ApiProperty({ type: RegisterCommandResponse })
  data: RegisterCommandResponse;
}