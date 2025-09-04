import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsNotEmpty } from "class-validator";
import { UserRole } from "@/core/domain/roles";

export class LoginWithPhoneNumberOtpCommand {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ type: String, enum: UserRole })
  @IsNotEmpty()
  role: UserRole;

  constructor(data?: OmitMethods<LoginWithPhoneNumberOtpCommand>) {
    if (data) Object.assign(this, data);
  }
}
