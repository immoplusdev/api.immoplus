import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsNotEmpty } from "class-validator";

export class LoginWithPhoneNumberOtpCommand {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
  constructor(data?: OmitMethods<LoginWithPhoneNumberOtpCommand>) {
    if (data) Object.assign(this, data);
  }
}
