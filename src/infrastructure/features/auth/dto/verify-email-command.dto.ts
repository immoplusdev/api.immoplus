import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailCommandDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  otp: string;
  constructor(data?: OmitMethods<VerifyEmailCommandDto>) {
    Object.assign(this, data);
  }
}
