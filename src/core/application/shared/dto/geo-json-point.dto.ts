import { IsNotEmpty } from "class-validator";
import { IsGeoJsonPointCoordinates } from "@/lib/ts-utilities/class-validator";
import { GeoJsonType } from "@/core/domain/map";
import { ApiProperty } from "@nestjs/swagger";

export class GeoJsonPointDto {
  @ApiProperty({ enum: GeoJsonType })
  @IsNotEmpty()
  type: GeoJsonType;
  @ApiProperty({ type: Number, isArray: true })
  @IsGeoJsonPointCoordinates()
  coordinates: Array<number>;

  constructor(long: number, lat: number) {
    this.coordinates = [long, lat];
    this.type = GeoJsonType.Point;
  }
}
