import { BaseException } from "@/core/domain/shared/exceptions";

export class InvalidOtpException extends BaseException {
  constructor() {
    super("$t:all.exception.invalid_otp", 403);
  }
}
