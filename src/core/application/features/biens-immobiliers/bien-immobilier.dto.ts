import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { Amentity, StatusValidationBienImmobilier, TypeBienImmobilier } from "@/core/domain/biens-immobiliers";
import { GeoJsonPoint } from "@/core/domain/map";
import { GeoJsonPointDto } from "@/infrastructure/shared/dto";
import { File } from "@/core/domain/files";
import { AmentityDto } from "@/core/application/features/biens-immobiliers/amentity.dto";

export class BienImmobilierDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid" })
  miniature: File | string;

  @ApiProperty({ format: "uuid" })
  miniatureId: string;

  @ApiProperty()
  nom: string;

  @ApiProperty({ enum: TypeBienImmobilier })
  typeBienImmobilier: TypeBienImmobilier;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: () => AmentityDto, isArray: true })
  amentities?: Amentity[];

  @ApiProperty({ type: "string", isArray: true })
  tags?: string[];

  @ApiProperty({ type: "string", format: "uuid", isArray: true })
  images?: string[];

  @ApiProperty({ format: "uuid" })
  video?: string;

  @ApiProperty({ format: "uuid" })
  ville?: string;

  @ApiProperty({ format: "uuid" })
  commune?: string;

  @ApiProperty()
  adresse?: string;

  @ApiProperty({ type: GeoJsonPointDto })
  position?: GeoJsonPoint;

  @ApiProperty({ enum: StatusValidationBienImmobilier })
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

  @ApiProperty({format: "uuid"})
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

export class WrapperResponseBienImmobilierListDto extends WrapperResponseDto<BienImmobilierDto[]> {
  @ApiProperty({ type: [BienImmobilierDto] })
  data: BienImmobilierDto[];
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  hasPrevious: boolean;
  @ApiProperty()
  hasNext: boolean;
}

