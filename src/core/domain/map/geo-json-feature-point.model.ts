import { IsNotEmpty, IsOptional } from "class-validator";
import { GeoJsonType } from "./geo-json-type.enum";
import { GeoJsonPoint } from "./geo-json-point.model";
import { IsGeoJsonPoint } from "@/lib/ts-utilities";

export class GeoJsonFeaturePoint {
  @IsNotEmpty()
  readonly type: GeoJsonType.Feature;
  @IsOptional()
  properties?: Record<string, any>;
  @IsGeoJsonPoint()
  geometry: GeoJsonPoint;
  constructor(long?: number, lat?: number, properties?: Record<string, any>) {
    this.type = GeoJsonType.Feature;
    if (properties) this.properties = properties;
    if (long && lat) this.geometry = new GeoJsonPoint(long, lat);
  }
}
