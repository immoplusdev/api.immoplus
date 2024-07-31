import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";

export class VerifyPhoneNumberCommandDto {
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  otp: string;
  constructor(data?: OmitMethods<VerifyPhoneNumberCommandDto>) {
    Object.assign(this, data);
  }
}
