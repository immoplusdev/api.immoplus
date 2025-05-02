import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";

export class CreateUserCommandResponse {
  constructor(data?: OmitMethods<CreateUserCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseCreateUserCommandResponseDto extends WrapperResponseDto<CreateUserCommandResponse> {
  @ApiProperty({ type: CreateUserCommandResponse })
  data: CreateUserCommandResponse;
}

