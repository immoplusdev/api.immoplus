import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";
import { IsEmail } from "class-validator";

export class SendEmailOtpCommand {
  @ApiProperty()
  @IsEmail()
  email: string;
  constructor(data?: OmitMethods<SendEmailOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}