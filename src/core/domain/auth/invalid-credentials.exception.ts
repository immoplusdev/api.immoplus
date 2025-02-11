import { BaseException } from "@/core/domain/shared/exceptions";

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(`$t:all.exception.invalid_credentials`, 401);
  }
}
