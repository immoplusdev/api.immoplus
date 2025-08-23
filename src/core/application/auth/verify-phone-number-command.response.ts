import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@/core/domain/common/docs";

export class VerifyPhoneNumberCommandResponse {
  constructor(data?: OmitMethods<VerifyPhoneNumberCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseVerifyPhoneNumberCommandResponseDto extends WrapperResponseDto<VerifyPhoneNumberCommandResponse> {
  @ApiProperty({ type: VerifyPhoneNumberCommandResponse })
  data: VerifyPhoneNumberCommandResponse;
}
