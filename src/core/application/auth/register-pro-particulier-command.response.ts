import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";
import { UserDto } from "@/core/application/users";

export class RegisterProParticulierCommandResponse {
  user: UserDto;
  constructor(data?: OmitMethods<RegisterProParticulierCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseRegisterProParticulierCommandResponseDto extends WrapperResponseDto<RegisterProParticulierCommandResponse> {
  @ApiProperty({ type: RegisterProParticulierCommandResponse })
  data: RegisterProParticulierCommandResponse;
}

