import { IsValidPassword, IsValidPhoneNumber, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterProParticulierCommand {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
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
  photoIdentiteId: string;
  @ApiProperty()
  @IsNotEmpty()
  pieceIdentiteId: string;

  constructor(data?: OmitMethods<RegisterProParticulierCommand>) {
    if (data) Object.assign(this, data);
  }
}