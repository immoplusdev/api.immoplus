// import { GeoJsonPoint } from "@/core/domain/map/geo-json-point.model";
// import { GeoJsonType } from "@/core/domain/map/geo-json-type.enum";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from "class-validator";

export function IsGeoJsonPoint(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsGeoJsonPoint",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value.type == "Point" && value.coordinates.length == 2;
        },
      },
    });
  };
}
