import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IsValidPhoneNumber } from "@/lib/ts-utilities/class-validator/is-valid-phone-number.validator";
import { IsValidPassword } from "@/lib/ts-utilities/class-validator/is-valid-password.validator";

export class RegisterCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsOptional()
  city?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsValidPhoneNumber()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsValidPassword()
  password: string;

  constructor(data?: OmitMethods<RegisterCommandDto>) {
    Object.assign(this, data);
  }
}