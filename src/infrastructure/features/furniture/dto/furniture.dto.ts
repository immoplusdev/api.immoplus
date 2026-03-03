import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { FurnitureStatus } from "@/core/domain/furniture";
import { FurnitureMetadata } from "@/core/domain/furniture/furniture-metadata";
import { GeoJsonPoint } from "@/core/domain/map";
import { GeoJsonPointDto } from "@/core/application/common/dto";

export class FurnitureDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid" })
  owner: string;

  @ApiProperty({ required: false })
  ownerPhoneNumber?: string;

  @ApiProperty({ format: "uuid" })
  ville?: string;

  @ApiProperty({ format: "uuid" })
  commune?: string;

  @ApiProperty()
  adresse: string;

  @ApiProperty({ type: GeoJsonPointDto })
  position?: GeoJsonPoint;

  @ApiProperty()
  lat?: number;

  @ApiProperty()
  lng?: number;

  @ApiProperty()
  titre: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  prix: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ enum: ["neuf", "reconditionne", "occasion"] })
  etat: "neuf" | "reconditionne" | "occasion";

  @ApiProperty({ type: "string", format: "uuid", isArray: true })
  images?: string[];

  @ApiProperty({ format: "uuid" })
  video?: string;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  score: number;

  @ApiProperty({ enum: FurnitureStatus, enumName: "FurnitureStatus" })
  status: FurnitureStatus;

  @ApiProperty()
  metadata?: FurnitureMetadata;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  deletedAt?: Date;

  @ApiProperty({ format: "uuid" })
  createdBy?: string;

  constructor(data?: OmitMethods<FurnitureDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseFurnitureDto extends WrapperResponseDto<FurnitureDto> {
  @ApiProperty({ type: FurnitureDto })
  data: FurnitureDto;
}

export class WrapperResponseFurnitureBatchDto extends WrapperResponseDto<
  FurnitureDto[]
> {
  @ApiProperty({ type: [FurnitureDto] })
  data: FurnitureDto[];
}
