import { BaseException } from "@/core/domain/common/exceptions";

export class InvalidPasswordException extends BaseException {
  constructor() {
    super(`INVALID_PASSWORD`, 401);
  }
}
