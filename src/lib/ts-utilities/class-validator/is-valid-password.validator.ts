import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
class IsValidPasswordValidator implements ValidatorConstraintInterface {
  validate(password: any) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return typeof password === "string" && passwordRegex.test(password);
  }

  defaultMessage() {
    return `The password should respect the following rules:
    At least 8 characters long.
    Contains at least one uppercase letter.
    Contains at least one lowercase letter.
    Contains at least one number.
    Contains at least one special character.
    `;
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