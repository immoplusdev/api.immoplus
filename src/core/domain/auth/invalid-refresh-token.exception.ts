import { BaseException } from "@/core/domain/common/exceptions";

export class InvalidRefreshTokenException extends BaseException {
  constructor() {
    super(
      "$t:all.exception.invalid_refresh_token",
      401,
      "Unauthorized",
      "INVALID_REFRESH_TOKEN",
    );
  }
}
