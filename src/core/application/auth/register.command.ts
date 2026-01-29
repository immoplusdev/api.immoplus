import { IsValidPhoneNumber, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SocialAuthProvider } from "@/core/application/auth/social-login.command";

export class RegisterCommand {
  @ApiProperty()
  @IsOptional()
  avatar: string;
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty({ message: "$t:all.exception.invalid_email_format_exception" })
  @IsEmail({}, { message: "$t:all.exception.invalid_email_format_exception" })
  email: string;
  @ApiProperty()
  @IsValidPhoneNumber()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty({ message: "$t:all.exception.empty_password_exception" })
  password: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ enum: SocialAuthProvider, required: false })
  @IsEnum(SocialAuthProvider, {
    message: "$t:all.exception.invalid_social_provider",
  })
  @IsOptional()
  provider?: SocialAuthProvider;

  constructor(data?: OmitMethods<RegisterCommand>) {
    Object.assign(this, data);
  }
}
