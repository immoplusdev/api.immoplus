import { IsValidPhoneNumber, OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

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

  constructor(data?: OmitMethods<RegisterProEntrepriseCommand>) {
    if (data) Object.assign(this, data);
  }
}
