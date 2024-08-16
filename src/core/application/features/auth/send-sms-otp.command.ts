import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SendSmsOtpCommand {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  constructor(data?: OmitMethods<SendSmsOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}