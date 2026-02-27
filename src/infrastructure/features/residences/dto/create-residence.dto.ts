import { ApiProperty } from "@/core/domain/common/docs";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { Commodite, TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
import { CommoditeDto, PieceDto } from "@/infrastructure/features/residences";
import { GeoJsonPointDto } from "@/core/application/common/dto";
import { NoContactInfo } from "@/infrastructure/decorators/no-contact-info.validator";

export class CreateResidenceDto {
  @ApiProperty({ format: "uuid" })
  @IsNotEmpty()
  miniature: string;

  @ApiProperty()
  @IsNotEmpty()
  @NoContactInfo({
    message: "Le nom ne doit pas contenir d'email ou de numéro de téléphone.",
  })
  nom: string;

  @ApiProperty({ enum: TypeResidence, enumName: "TypeResidence" })
  @IsIn(enumToList(TypeResidence))
  typeResidence: TypeResidence;

  @ApiProperty()
  @IsNotEmpty()
  @NoContactInfo({
    message:
      "La description ne doit pas contenir d'email ou de numéro de téléphone.",
  })
  description: string;

  @ApiProperty()
  @IsNumber()
  prixReservation: number;

  @ApiProperty({ format: "Abidjan, Cocody... " })
  @IsNotEmpty()
  @NoContactInfo({
    message:
      "L'adresse ne doit pas contenir d'email ou de numéro de téléphone.",
  })
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
