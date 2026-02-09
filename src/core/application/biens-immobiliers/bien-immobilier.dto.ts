import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import {
  Amentity,
  StatusValidationBienImmobilier,
  TypeBienImmobilier,
} from "@/core/domain/biens-immobiliers";
import { GeoJsonPoint } from "@/core/domain/map";
import { GeoJsonPointDto } from "@/core/application/common/dto";
import { AmentityDto } from "./amentity.dto";
import { IsOptional } from "class-validator";
import { Ville } from "@/core/domain/villes";
import { Commune } from "@/core/domain/communes";

export class BienImmobilierDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid" })
  miniature: string;

  @ApiProperty()
  nom: string;

  @ApiProperty({ enum: TypeBienImmobilier, enumName: "TypeBienImmobilier" })
  typeBienImmobilier: TypeBienImmobilier;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: () => AmentityDto, isArray: true })
  amentities?: Amentity[];

  @ApiProperty({ type: "string", isArray: true })
  tags?: string[];

  @ApiProperty({ type: "string", format: "uuid", isArray: true })
  images?: string[];

  @IsOptional()
  @ApiProperty({ format: "uuid" })
  video?: string;

  @ApiProperty({ format: "uuid" })
  ville?: Ville | string;

  @ApiProperty({ format: "uuid" })
  commune?: Commune | string;

  @ApiProperty()
  adresse?: string;

  @ApiProperty({ type: GeoJsonPointDto })
  position?: GeoJsonPoint;

  @ApiProperty({
    enum: StatusValidationBienImmobilier,
    enumName: "StatusValidationBienImmobilier",
  })
  statusValidation: StatusValidationBienImmobilier;

  @ApiProperty()
  prix: number;

  @ApiProperty()
  metadata?: Record<string, any>;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  bienImmobilierDisponible: boolean;

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

  constructor(data?: OmitMethods<BienImmobilierDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseBienImmobilierDto extends WrapperResponseDto<BienImmobilierDto> {
  @ApiProperty({ type: BienImmobilierDto })
  data: BienImmobilierDto;
}

export class WrapperResponseBienImmobilierBatchDto extends WrapperResponseDto<
  BienImmobilierDto[]
> {
  @ApiProperty({ type: [BienImmobilierDto] })
  data: BienImmobilierDto[];
}
