import { BaseException } from "@/core/domain/shared/exceptions";

export class UserCannotLoginException extends BaseException {
  constructor() {
    super("$t:all.exception.user_cannot_login", 401);
  }
}
