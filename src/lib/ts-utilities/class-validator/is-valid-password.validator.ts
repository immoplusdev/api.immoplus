import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
class IsValidPasswordValidator implements ValidatorConstraintInterface {
  validate(password: any) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[\w\d\s]{8,}$/;
    return typeof password === "string" && passwordRegex.test(password);
  }

  defaultMessage() {
    return `$t:all.exception.invalid_password_format_exception`;
  }
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordValidator,
    });
  };
}
