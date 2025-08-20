import { BaseException } from "@/core/domain/common/exceptions";

export class UserEmailAlreadyTakenException extends BaseException {
  constructor() {
    super(`L'email est déjà utilisée par un autre utilisateur`, 409);
  }
}
