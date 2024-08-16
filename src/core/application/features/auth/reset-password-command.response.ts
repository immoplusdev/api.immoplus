import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordCommandResponse {
  constructor(data?: OmitMethods<ResetPasswordCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseResetPasswordCommandResponseDto extends WrapperResponseDto<ResetPasswordCommandResponse> {
  @ApiProperty({ type: ResetPasswordCommandResponse })
  data: ResetPasswordCommandResponse;
}

