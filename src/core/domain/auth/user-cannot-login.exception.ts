import { BaseException } from "@/core/domain/common/exceptions";

export class UserCannotLoginException extends BaseException {
  constructor() {
    super(
      "$t:all.exception.user_cannot_login",
      401,
      "UserCannotLoginException",
      "UNAUTHORIZED",
    );
  }
}
