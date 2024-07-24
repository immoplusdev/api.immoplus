/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from "class-validator";

export function IsGeoJsonPointCoordinates(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsGeoJsonCoordinates",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: number[]) {
          return value.length == 2;
        },
      },
    });
  };
}
