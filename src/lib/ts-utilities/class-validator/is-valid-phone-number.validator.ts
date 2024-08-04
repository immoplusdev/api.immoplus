import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: any) {
    const phoneRegex = /^\d{1,3}-\d{4,14}$/; // E.164 format
    return typeof phoneNumber === "string" && phoneRegex.test(phoneNumber);
  }

  defaultMessage() {
    return "$t:all.validation.is_valid_phone_number";
  }
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}