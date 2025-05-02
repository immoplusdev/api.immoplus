import { BaseException } from "@/core/domain/common/exceptions";

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(`$t:all.exception.invalid_credentials`, 401);
  }
}
