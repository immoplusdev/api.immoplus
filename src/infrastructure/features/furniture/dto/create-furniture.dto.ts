import { ApiProperty } from "@/core/domain/common/docs";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { GeoJsonPoint } from "@/core/domain/map";
import { GeoJsonPointDto } from "@/core/application/common/dto";
import { FurnitureStatus } from "@/core/domain/furniture";
import {
  IsArray,
  IsIn,
  Matches,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class FurnitureMetadataDto {
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { each: true })
  colors?: string[];
}

export class CreateFurnitureDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  titre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  prix: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ enum: ["neuf", "reconditionne", "occasion"] })
  @IsNotEmpty()
  @IsIn(["neuf", "reconditionne", "occasion"])
  etat: "neuf" | "reconditionne" | "occasion";

  @ApiProperty({ format: "Abidjan, Cocody..." })
  @IsNotEmpty()
  @IsString()
  adresse: string;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  ville?: string;

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  commune?: string;

  @ApiProperty({ type: () => GeoJsonPointDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoJsonPointDto)
  position?: GeoJsonPoint;

  @ApiProperty({ description: "Latitude (double)" })
  @ValidateIf((object: CreateFurnitureDto) => object.lng !== undefined)
  @IsNumber()
  @Type(() => Number)
  lat?: number;

  @ApiProperty({ description: "Longitude (double)" })
  @ValidateIf((object: CreateFurnitureDto) => object.lat !== undefined)
  @IsNumber()
  @Type(() => Number)
  lng?: number;
  @ApiProperty({ type: "string", format: "uuid", isArray: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ format: "uuid" })
  @IsOptional()
  video?: string;
  @ApiProperty({
    enum: FurnitureStatus,
    enumName: "FurnitureStatus",
    default: FurnitureStatus.Active,
  })
  @IsOptional()
  @IsIn(enumToList(FurnitureStatus))
  status?: FurnitureStatus;

  @ApiProperty({ type: () => FurnitureMetadataDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FurnitureMetadataDto)
  metadata?: FurnitureMetadataDto;

  constructor(data?: OmitMethods<CreateFurnitureDto>) {
    if (data) Object.assign(this, data);
  }
}
