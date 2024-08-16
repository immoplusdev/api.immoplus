import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class SendSmsOtpCommandResponse {
  constructor(data?: OmitMethods<SendSmsOtpCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseSendSmsOtpCommandResponseDto extends WrapperResponseDto<SendSmsOtpCommandResponse> {
  @ApiProperty({ type: SendSmsOtpCommandResponse })
  data: SendSmsOtpCommandResponse;
}

