import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";

export class UpdateUserCommandResponse {
  constructor(data?: OmitMethods<UpdateUserCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseUpdateUserCommandResponseDto extends WrapperResponseDto<UpdateUserCommandResponse> {
  @ApiProperty({ type: UpdateUserCommandResponse })
  data: UpdateUserCommandResponse;
}
