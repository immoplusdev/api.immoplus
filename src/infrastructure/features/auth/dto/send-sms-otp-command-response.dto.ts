import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class SendSmsOtpCommandResponseDto {
  constructor(data?: OmitMethods<SendSmsOtpCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseSendSmsOtpCommandResponseDto extends WrapperResponseDto<SendSmsOtpCommandResponseDto> {
   @ApiProperty({ type: SendSmsOtpCommandResponseDto })
   data: SendSmsOtpCommandResponseDto;
}

