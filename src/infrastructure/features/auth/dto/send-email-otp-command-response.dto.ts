import { OmitMethods } from '@/lib/ts-utilities';
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";

export class SendEmailOtpCommandResponseDto {
  constructor(data?: OmitMethods<SendEmailOtpCommandResponseDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseSendEmailOtpCommandResponseDto extends WrapperResponseDto<SendEmailOtpCommandResponseDto> {
   @ApiProperty({ type: SendEmailOtpCommandResponseDto })
   data: SendEmailOtpCommandResponseDto;
}

