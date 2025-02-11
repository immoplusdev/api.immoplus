import { BaseException } from "@/core/domain/shared/exceptions";

export class InvalidPasswordException extends BaseException {
  constructor() {
    super(`INVALID_PASSWORD`, 401);
  }
}
