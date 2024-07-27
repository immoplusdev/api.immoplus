import { IsValidPhoneNumber, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IsValidPassword } from "@/lib/ts-utilities/class-validator/is-valid-password.validator";

export class RegisterProParticulierCommandDto {
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
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsValidPhoneNumber()
  phoneNumber: string;
  @ApiProperty()
  @IsValidPassword()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  activite: string;
  @ApiProperty()
  @IsNotEmpty()
  photoIdentite: string;
  @ApiProperty()
  @IsNotEmpty()
  pieceIdentite: string;
  constructor(data?: OmitMethods<RegisterProParticulierCommandDto>) {
    Object.assign(this, data);
  }
}
