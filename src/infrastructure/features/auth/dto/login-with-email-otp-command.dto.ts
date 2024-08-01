import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginWithEmailOtpCommandDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
  constructor(data?: OmitMethods<LoginWithEmailOtpCommandDto>) {
    Object.assign(this, data);
  }
}
