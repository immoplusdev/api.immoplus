import { BaseException } from "@/core/domain/common/exceptions";

export class InvalidCredentialsException extends BaseException {
  constructor({
    message = "$t:all.exception.invalid_credentials",
    statusCode = 401,
    error = "Unauthorized",
    code = "UNAUTHORIZED",
  }) {
    super(message, statusCode, error, code);
  }
}
