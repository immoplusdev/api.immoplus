import { ApiProperty } from "@/core/domain/common/docs";
import { IsArray, IsDateString, IsNotEmpty } from "class-validator";

export class UnavailabilityDateDto {
  @ApiProperty({ description: "Date d'indisponibilité au format ISO" })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class AddUnavailabilityDatesDto {
  @ApiProperty({
    type: [String],
    description:
      "Liste des dates d'indisponibilité à ajouter (format ISO: YYYY-MM-DD)",
    example: ["2024-03-15", "2024-03-16", "2024-03-17"],
  })
  @IsArray()
  @IsDateString({}, { each: true })
  @IsNotEmpty()
  dates: string[];
}

export class RemoveUnavailabilityDatesDto {
  @ApiProperty({
    type: [String],
    description:
      "Liste des dates d'indisponibilité à supprimer (format ISO: YYYY-MM-DD)",
    example: ["2024-03-15", "2024-03-16"],
  })
  @IsArray()
  @IsDateString({}, { each: true })
  @IsNotEmpty()
  dates: string[];
}

export class ReplaceUnavailabilityDatesDto {
  @ApiProperty({
    type: [String],
    description:
      "Liste des dates d'indisponibilité à définir (remplace toutes les dates existantes, format ISO: YYYY-MM-DD)",
    example: ["2024-03-15", "2024-03-16", "2024-03-17"],
  })
  @IsArray()
  @IsDateString({}, { each: true })
  dates: string[];
}
