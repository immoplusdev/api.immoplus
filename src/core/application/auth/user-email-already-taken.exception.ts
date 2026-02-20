import { BaseException } from "@/core/domain/common/exceptions";

export class UserEmailAlreadyTakenException extends BaseException {
  constructor() {
    super(
      `Cette adresse email est déjà utilisée pour un autre compte. Veuillez en utiliser une autre.`,
      409,
    );
  }
}
