import { IsValidPhoneNumber, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { SocialAuthProvider } from "@/core/application/auth/social-login.command";

export class RegisterProEntrepriseCommand {
  @ApiProperty()
  @IsOptional()
  avatar: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsValidPhoneNumber()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty({ message: "$t:all.exception.empty_password_exception" })
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  nomEntreprise: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  emailEntreprise: string;
  @ApiProperty({ format: "binary" })
  @IsNotEmpty()
  registreCommerceId: string;
  @ApiProperty()
  @IsNotEmpty()
  numeroContribuable: string;
  @ApiProperty()
  @IsNotEmpty()
  typeEntreprise: string;
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

  constructor(data?: OmitMethods<RegisterProEntrepriseCommand>) {
    if (data) Object.assign(this, data);
  }
}
