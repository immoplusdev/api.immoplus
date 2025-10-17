import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyPinDto {
  @ApiProperty({
    description: "Code PIN à vérifier",
    example: "1234",
  })
  @IsString()
  @Length(4, 4, { message: "Le code PIN doit faire exactement 4 caractères" })
  pin: string;
}
