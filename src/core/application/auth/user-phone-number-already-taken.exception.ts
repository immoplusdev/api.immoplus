import { BaseException } from "@/core/domain/common/exceptions";

export class UserPhoneNumberAlreadyTakenException extends BaseException {
  constructor() {
    super(
      `Le numéro de téléphone est déjà utilisé par un autre utilisateur`,
      409,
    );
  }
}
