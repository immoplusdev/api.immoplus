import { IsValidPhoneNumber, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IsValidPassword } from "@/lib/ts-utilities/class-validator/is-valid-password.validator";

export class RegisterProEntrepriseCommandDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // firstName: string;
  // @ApiProperty()
  // @IsNotEmpty()
  // lastName: string;
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
  nomEntreprise: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  emailEntreprise: string;
  @ApiProperty({ format: "binary" })
  @IsNotEmpty()
  registreCommerce: string;
  @ApiProperty()
  @IsNotEmpty()
  numeroContribuable: string;
  @ApiProperty()
  @IsNotEmpty()
  typeEntreprise: string;

  constructor(data?: OmitMethods<RegisterProEntrepriseCommandDto>) {
    Object.assign(this, data);
  }
}
