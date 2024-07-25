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
    return "Phone number must be a valid phone number of the following format 225-0123456789";
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