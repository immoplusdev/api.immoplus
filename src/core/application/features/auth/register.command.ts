import { IsValidPassword, IsValidPhoneNumber, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterCommand {
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
  @IsNotEmpty({ message: "$t:all.exception.empty_password_exception"})
  // @IsValidPassword()
  password: string;

  constructor(data?: OmitMethods<RegisterCommand>) {
    Object.assign(this, data);
  }
}
