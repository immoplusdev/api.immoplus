import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SendSmsOtpCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  constructor(data?: OmitMethods<SendSmsOtpCommandDto>) {
    Object.assign(this, data);
  }
}
