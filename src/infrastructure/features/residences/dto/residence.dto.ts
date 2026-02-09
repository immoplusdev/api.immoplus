import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";
import { CommoditeDto, PieceDto } from "@/infrastructure/features/residences";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { GeoJsonPointDto } from "@/core/application/common/dto";
import { IsOptional } from "class-validator";
import { Ville } from "@/core/domain/villes";
import { Commune } from "@/core/domain/communes";

export class ResidenceDto {
  @ApiProperty({ format: "uuid" })
  id: string;
  @ApiProperty({ format: "uuid" })
  miniature: string;
  @ApiProperty()
  nom: string;
  @ApiProperty({ enum: TypeResidence, enumName: "TypeResidence" })
  typeResidence: TypeResidence;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: () => CommoditeDto, isArray: true })
  commodites?: CommoditeDto[];
  @ApiProperty({ type: () => PieceDto, isArray: true })
  pieces?: Piece[];
  @ApiProperty({ type: "string", format: "uuid", isArray: true })
  images?: string[];
  @IsOptional()
  @ApiProperty({ format: "uuid" })
  video?: string;
  @ApiProperty({ format: "uuid" })
  ville_id?: string;
  @ApiProperty({ format: "uuid" })
  commune_id?: string;
  @ApiProperty({ format: "uuid" })
  ville?: string;
  @ApiProperty({ format: "uuid" })
  commune?: string;
  @ApiProperty()
  ville_model?: Ville;
  @ApiProperty()
  commune_model?: Commune;
  @ApiProperty()
  adresse?: string;

  @ApiProperty({
    enum: StatusValidationBienImmobilier,
    enumName: "StatusValidationBienImmobilier",
  })
  statusValidation: StatusValidationBienImmobilier;

  @ApiProperty({ type: GeoJsonPointDto })
  position?: GeoJsonPoint;
  @ApiProperty()
  residenceDisponible: boolean;
  @ApiProperty()
  prixReservation: number;
  @ApiProperty()
  dureeMinSejour: number;
  @ApiProperty()
  dureeMaxSejour: number;
  @ApiProperty()
  metadata?: Record<string, any>;
  @ApiProperty()
  heureEntree: string;
  @ApiProperty()
  heureDepart: string;
  @ApiProperty()
  nombreMaxOccupants: number;
  @ApiProperty()
  animauxAutorises: boolean;
  @ApiProperty()
  fetesAutorises: boolean;
  @ApiProperty()
  reglesSupplementaires?: string;
  @ApiProperty({ format: "uuid" })
  proprietaire?: string;

  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  deletedAt?: Date;

  @ApiProperty()
  createdBy?: string;

  constructor(data?: OmitMethods<ResidenceDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseResidenceDto extends WrapperResponseDto<ResidenceDto> {
  @ApiProperty({ type: ResidenceDto })
  data: ResidenceDto;
}

export class WrapperResponseResidenceBatchDto extends WrapperResponseDto<
  ResidenceDto[]
> {
  @ApiProperty({ type: [ResidenceDto] })
  data: ResidenceDto[];
}
