import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SetPinDto {
  @ApiProperty({
    description: "Code PIN à 4 chiffres",
    example: "1234",
  })
  @IsString()
  @Length(4, 4, { message: "Le code PIN doit faire exactement 4 caractères" })
  pin: string;
}
