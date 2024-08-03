import { IsNotEmpty } from "class-validator";
import { GeoJsonType } from "./geo-json-type.enum";
import { IsGeoJsonPointCoordinates } from "@/lib/ts-utilities/class-validator";

export class GeoJsonPoint {
  @IsNotEmpty()
  readonly type: GeoJsonType;
  @IsGeoJsonPointCoordinates()
  coordinates: Array<number>;
  constructor(long: number, lat: number) {
    this.coordinates = [long, lat];
    this.type = GeoJsonType.Point;
  }
}
