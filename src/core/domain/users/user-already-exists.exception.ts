import { BaseException } from "@/core/domain/shared/exceptions";

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super(`$t:all.exception.user_already_exists`, 409);
  }
}
