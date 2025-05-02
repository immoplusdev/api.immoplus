import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@/core/domain/common/docs";

export class VerifyEmailCommand {
  @ApiProperty()
  email: string;
  @ApiProperty()
  otp: string;
  constructor(data?: OmitMethods<VerifyEmailCommand>) {
    if(data) Object.assign(this, data);
  }
}