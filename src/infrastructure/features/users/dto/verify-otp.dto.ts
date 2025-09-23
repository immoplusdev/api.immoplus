import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, IsEmail } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Code OTP à 6 chiffres",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}

export class VerifyOtpResponseDto {
  @ApiProperty({
    description: "Données de la réponse de vérification",
    example: {
      success: true,
      token: "99d958a88e50eddaf9990be6e4d9fd7bea5b3d5cea519bf744b25a56fac37448",
      email: "dev.johnlight@gmail.com",
    },
  })
  data: {
    success: boolean;
    token?: string;
    email?: string;
  };
}