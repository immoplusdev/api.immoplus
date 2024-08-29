import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { Amentity, TypeBienImmobilier, TypeLocationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { GeoJsonPointDto } from "@/core/application/shared/dto";
import { GeoJsonPoint } from "@/core/domain/map";
import { IsEnum, IsOptional } from "class-validator";
import { AmentityDto } from "@/core/application/features/biens-immobiliers/amentity.dto";

export class CreateBienImmobilierDto {

  @ApiProperty({ format: "uuid" })
  miniature: string;

  @ApiProperty()
  nom: string;

  @ApiProperty({ enum: TypeBienImmobilier })
  @IsEnum(TypeBienImmobilier)
  typeBienImmobilier: TypeBienImmobilier;

  @ApiProperty({ enum: TypeLocationBienImmobilier })
  @IsEnum(TypeLocationBienImmobilier)
  @IsOptional()
  typeLocation: TypeLocationBienImmobilier;

  @ApiProperty()
  @IsOptional()
  aLouer: boolean;

  @ApiProperty()
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
  
  constructor(data?: OmitMethods<CreateBienImmobilierDto>) {
    if (data) Object.assign(this, data);
  }
}