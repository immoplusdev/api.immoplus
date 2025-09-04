import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsEmail, IsNotEmpty } from "class-validator";
import { UserRole } from "@/core/domain/roles";

export class LoginWithEmailOtpCommand {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ type: String, enum: UserRole })
  @IsNotEmpty()
  role: UserRole;

  constructor(data?: OmitMethods<LoginWithEmailOtpCommand>) {
    if (data) Object.assign(this, data);
  }
}
