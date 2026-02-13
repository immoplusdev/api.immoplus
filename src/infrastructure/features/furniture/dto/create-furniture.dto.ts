import { ApiProperty } from "@/core/domain/common/docs";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { GeoJsonPoint } from "@/core/domain/map";
import { GeoJsonPointDto } from "@/core/application/common/dto";
import { FurnitureStatus } from "@/core/domain/furniture";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

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
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lat?: number;

  @ApiProperty({ description: "Longitude (double)" })
  @IsOptional()
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
  @ApiProperty()
  @IsOptional()
  metadata?: Record<string, any>;

  constructor(data?: OmitMethods<CreateFurnitureDto>) {
    if (data) Object.assign(this, data);
  }
}
