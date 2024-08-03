import { ApiProperty } from "@nestjs/swagger";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Commodite, StatusValidationResidence, TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";

export class UpdateResidenceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  miniature: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  nom: string;
  @ApiProperty()
  @IsIn(enumToList(TypeResidence))
  @IsOptional()
  typeResidence: TypeResidence;
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
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
  @IsOptional()
  prixReservation: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  dureeMinSejour: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  dureeMaxSejour: number;
  @ApiProperty()
  @IsOptional()
  metadata?: Record<string, any>;
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  heureEntree: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
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

  constructor(data?: OmitMethods<UpdateResidenceDto>) {
    Object.assign(this, data);
  }
}