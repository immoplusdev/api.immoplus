import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class SendEmailOtpCommandResponse {
  constructor(data?: OmitMethods<SendEmailOtpCommandResponse>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseSendEmailOtpCommandResponseDto extends WrapperResponseDto<SendEmailOtpCommandResponse> {
  @ApiProperty({ type: SendEmailOtpCommandResponse })
  data: SendEmailOtpCommandResponse;
}

