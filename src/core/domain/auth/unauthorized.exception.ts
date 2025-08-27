import { BaseException } from "@/core/domain/common/exceptions";

export class UnauthorizedException extends BaseException {
  constructor({
    message = "Unauthorized",
    statusCode = 401,
    error = "Unauthorized",
    code = "UNAUTHORIZED",
  }) {
    super(message, statusCode, error, code);
  }
}
