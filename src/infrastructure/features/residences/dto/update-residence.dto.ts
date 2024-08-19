import { ApiProperty } from "@nestjs/swagger";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Commodite, TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";
import { CommoditeDto, PieceDto } from "@/infrastructure/features/residences";
import { GeoJsonPointDto } from "@/core/application/shared/dto";

export class UpdateResidenceDto {

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  miniature: string;

  @ApiProperty()
  @IsOptional()
  nom: string;

  @ApiProperty({ enum: TypeResidence })
  @IsIn(enumToList(TypeResidence))
  @IsOptional()
  typeResidence: TypeResidence;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  prixReservation: number;

  @ApiProperty({ format: "Abidjan, Cocody... " })
  @IsNotEmpty()
  @IsOptional()
  adresse?: string;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  ville?: string;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  commune?: string;

  @ApiProperty({ type: () => GeoJsonPointDto })
  @IsOptional()
  position?: GeoJsonPoint;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  video?: string;

  @ApiProperty({ type: "string", format: "uuid", isArray: true })
  @IsOptional()
  images?: string[];


  @ApiProperty({ type: () => CommoditeDto, isArray: true })
  @IsOptional()
  commodites?: Commodite[];

  @ApiProperty({ type: () => PieceDto, isArray: true })
  @IsOptional()
  pieces?: Piece[];

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

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  proprietaire?: string;

  @ApiProperty()
  @IsOptional()
  residenceDisponible: boolean;

  constructor(data?: OmitMethods<UpdateResidenceDto>) {
    Object.assign(this, data);
  }
}