import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { Amentity, TypeBienImmobilier } from "@/core/domain/biens-immobiliers";
import { AmentityDto } from "@/infrastructure/features/biens-immobiliers";
import { IsOptional } from "class-validator";
import { GeoJsonPointDto } from "@/infrastructure/shared/dto";
import { GeoJsonPoint } from "@/core/domain/map";

export class UpdateBienImmobilierDto {
  @ApiProperty({ format: "uuid" })
  @IsOptional()
  miniature: string;

  @ApiProperty()
  @IsOptional()
  nom: string;

  @ApiProperty({ enum: TypeBienImmobilier })
  @IsOptional()
  typeBienImmobilier: TypeBienImmobilier;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty({ type: () => AmentityDto, isArray: true })
  @IsOptional()
  amentities?: Amentity[];

  @ApiProperty({ type: "string", isArray: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: "string", format: "uuid", isArray: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  video?: string;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  ville: string;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  commune: string;

  @ApiProperty()
  @IsOptional()
  adresse?: string;

  @ApiProperty({ type: GeoJsonPointDto })
  @IsOptional()
  position?: GeoJsonPoint;

  @ApiProperty()
  @IsOptional()
  prix: number;

  @ApiProperty()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  nombreMaxOccupants: number;

  @ApiProperty()
  @IsOptional()
  animauxAutorises: boolean;

  @ApiProperty()
  @IsOptional()
  bienImmobilierDisponible: boolean;

  @ApiProperty()
  @IsOptional()
  fetesAutorises: boolean;

  @ApiProperty()
  @IsOptional()
  reglesSupplementaires?: string;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  proprietaire?: string;

  constructor(data?: OmitMethods<UpdateBienImmobilierDto>) {
    if (data) Object.assign(this, data);
  }
}