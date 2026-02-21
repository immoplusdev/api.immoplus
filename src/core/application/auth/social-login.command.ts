import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { UserApp } from "@/core/domain/roles";

export enum SocialAuthProvider {
  Google = "google",
  Facebook = "facebook",
  Apple = "apple",
}

export class SocialLoginCommand {
  @ApiProperty({ enum: SocialAuthProvider })
  @IsEnum(SocialAuthProvider, {
    message: "$t:all.exception.invalid_social_provider",
  })
  @IsNotEmpty()
  provider: SocialAuthProvider;

  @ApiProperty()
  @IsNotEmpty({ message: "$t:all.exception.token_required" })
  token: string;

  @ApiProperty()
  @IsEmail({}, { message: "$t:all.exception.invalid_email_format" })
  @IsOptional()
  email?: string;

  @ApiProperty({ type: String, enum: UserApp })
  @IsOptional()
  source?: UserApp;

  constructor(data?: OmitMethods<SocialLoginCommand>) {
    if (data) Object.assign(this, data);
  }
}
