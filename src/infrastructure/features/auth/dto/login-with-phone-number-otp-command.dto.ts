import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginWithPhoneNumberOtpCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
  constructor(data?: OmitMethods<LoginWithPhoneNumberOtpCommandDto>) {
    Object.assign(this, data);
  }
}
