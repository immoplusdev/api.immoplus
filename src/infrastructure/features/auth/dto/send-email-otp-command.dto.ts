import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendEmailOtpCommandDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  constructor(data?: OmitMethods<SendEmailOtpCommandDto>) {
    Object.assign(this, data);
  }
}
