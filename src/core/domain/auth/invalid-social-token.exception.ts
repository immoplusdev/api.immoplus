import { BaseException } from "@/core/domain/common/exceptions";

export class InvalidSocialTokenException extends BaseException {
  constructor({
    message = "$t:all.exception.invalid_social_token",
    statusCode = 401,
    error = "Unauthorized",
    code = "INVALID_SOCIAL_TOKEN",
  } = {}) {
    super(message, statusCode, error, code);
  }
}
