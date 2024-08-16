import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendEmailOtpCommand {
  @ApiProperty()
  @IsEmail()
  email: string;
  constructor(data?: OmitMethods<SendEmailOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}