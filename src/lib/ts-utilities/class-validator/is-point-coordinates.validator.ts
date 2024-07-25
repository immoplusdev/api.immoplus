import {
  // ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint()
export class IsPointCoordinates implements ValidatorConstraintInterface {
  validate(
    coordinates: number[]
    // , validationArguments: ValidationArguments
  ) {
    return coordinates.length != 2;
    // return coordinates.length != validationArguments.constraints[0];
  }
}
