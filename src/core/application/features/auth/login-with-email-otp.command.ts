import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginWithEmailOtpCommand {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
  constructor(data?: OmitMethods<LoginWithEmailOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}