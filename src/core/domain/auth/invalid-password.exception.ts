import { BaseException } from "@/core/domain/common/exceptions";

export class InvalidPasswordException extends BaseException {
  constructor() {
    super(
      "$t:all.exception.invalid_refresh_token",
      401,
      "Unauthorized",
      "INVALID_PASSWORD",
    );
  }
}
