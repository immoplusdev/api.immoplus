import { ApiProperty } from "@nestjs/swagger";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { Commodite, StatusValidationResidence, TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateResidenceDto {
  @ApiProperty()
  @IsNotEmpty()
  miniature: string;
  @ApiProperty()
  @IsNotEmpty()
  nom: string;
  @ApiProperty()
  @IsIn(enumToList(TypeResidence))
  typeResidence: TypeResidence;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsOptional()
  commodites?: Commodite[];
  @ApiProperty()
  @IsOptional()
  pieces?: Piece[];
  @ApiProperty()
  @IsOptional()
  images?: string[];
  @ApiProperty()
  @IsOptional()
  video?: string;
  @ApiProperty()
  @IsOptional()
  ville?: string;
  @ApiProperty()
  @IsOptional()
  commune?: string;
  @ApiProperty()
  @IsOptional()
  adresse?: string;
  @ApiProperty()
  @IsOptional()
  position?: GeoJsonPoint;
  @ApiProperty()
  @IsOptional()
  residenceDisponible: boolean;
  @ApiProperty()
  @IsOptional()
  statusValidation: StatusValidationResidence;
  @ApiProperty()
  @IsNumber()
  prixReservation: number;
  @ApiProperty()
  @IsNumber()
  dureeMinSejour: number;
  @ApiProperty()
  @IsNumber()
  dureeMaxSejour: number;
  @ApiProperty()
  @IsOptional()
  metadata?: Record<string, any>;
  @ApiProperty()
  @IsNotEmpty()
  heureEntree: string;
  @ApiProperty()
  @IsNotEmpty()
  heureDepart: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  nombreMaxOccupants: number;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  animauxAutorises: boolean;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  fetesAutorises: boolean;
  @ApiProperty()
  @IsOptional()
  reglesSupplementaires?: string;
  @ApiProperty()
  @IsOptional()
  proprietaire?: string;

  constructor(data?: OmitMethods<CreateResidenceDto>) {
    Object.assign(this, data);
  }
}