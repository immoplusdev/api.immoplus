import { BaseException } from "@/core/domain/shared/exceptions";

export class UserNotFoundException extends BaseException {
  constructor() {
    super(`$t:all.exception.user_not_found`, 404);
  }
}
