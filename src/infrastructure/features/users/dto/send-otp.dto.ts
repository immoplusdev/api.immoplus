import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SendOtpDto {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SendOtpResponseDto {
  @ApiProperty({
    description: "Données de la réponse",
    example: { message: "Code de vérification envoyé par email avec succès" },
  })
  data: {
    message: string;
  };
}
