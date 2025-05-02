import { BaseException } from "@/core/domain/common/exceptions";

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super(`$t:all.exception.user_already_exists`, 409);
  }
}
