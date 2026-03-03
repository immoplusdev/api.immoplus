import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

function normalizeText(input: string): string {
  return (
    input
      .toLowerCase()
      // neutralise les contournements courants email
      .replace(/\(at\)|\[at\]|\sat\s|arobase/g, "@")
      .replace(/\(dot\)|\[dot\]|\sdot\s|point/g, ".")
      // supprime certains séparateurs pour mieux détecter les numéros
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // caractères invisibles
      .replace(/\s+/g, " ")
      .trim()
  );
}

// Email (simple + robuste)
const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

// Téléphone (tolère +225, espaces, tirets, parenthèses)
// Objectif: attraper la majorité des formats saisis par les utilisateurs
const PHONE_REGEX =
  /(?<!\d)(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{1,4}\)?[\s.-]?)?(?:\d[\s.-]?){7,14}\d(?!\d)/;

@ValidatorConstraint({ name: "noContactInfo", async: false })
export class NoContactInfoConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value !== "string") return true;

    const text = normalizeText(value);

    // Détection directe
    if (EMAIL_REGEX.test(text)) return false;

    // Détection téléphone : on enlève les espaces/tirets puis on teste
    const compact = text.replace(/[\s().-]/g, "");
    if (PHONE_REGEX.test(text) || /^\+?\d{8,15}$/.test(compact)) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} ne doit pas contenir d'email ni de numéro de téléphone.`;
  }
}

export function NoContactInfo(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoContactInfoConstraint,
    });
  };
}
