import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailCommandResponse {
  constructor(data?: OmitMethods<VerifyEmailCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseVerifyEmailCommandResponseDto extends WrapperResponseDto<VerifyEmailCommandResponse> {
  @ApiProperty({ type: VerifyEmailCommandResponse })
  data: VerifyEmailCommandResponse;
}

