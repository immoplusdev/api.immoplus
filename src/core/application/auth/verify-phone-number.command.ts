import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";

export class VerifyPhoneNumberCommand {
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  otp: string;
  constructor(data?: OmitMethods<VerifyPhoneNumberCommand>) {
    if (data) Object.assign(this, data);
  }
}
