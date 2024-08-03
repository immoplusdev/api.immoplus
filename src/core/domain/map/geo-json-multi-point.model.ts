import { ArrayNotEmpty, IsNotEmpty } from "class-validator";
import { GeoJsonType } from "./geo-json-type.enum";
import { GeoJsonCoordinates } from "./geo-json-coordinates.model";

export class GeoJsonMultiPoint {
  @IsNotEmpty()
  type: GeoJsonType.MultiPoint;
  @ArrayNotEmpty()
  coordinates: Array<GeoJsonCoordinates>;
}
