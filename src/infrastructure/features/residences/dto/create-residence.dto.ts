import { ApiProperty } from "@/core/domain/common/docs";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { Commodite, TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { CommoditeDto, PieceDto } from "@/infrastructure/features/residences";
import { GeoJsonPointDto } from "@/core/application/common/dto";

export class CreateResidenceDto {
  @ApiProperty({ format: "uuid" })
  @IsNotEmpty()
  miniature: string;

  @ApiProperty()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ enum: TypeResidence, enumName: "TypeResidence" })
  @IsIn(enumToList(TypeResidence))
  typeResidence: TypeResidence;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  prixReservation: number;

  @ApiProperty({ format: "Abidjan, Cocody... " })
  @IsNotEmpty()
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

  constructor(data?: OmitMethods<CreateResidenceDto>) {
    Object.assign(this, data);
  }
}
