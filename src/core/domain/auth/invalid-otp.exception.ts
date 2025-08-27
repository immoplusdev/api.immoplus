import { BaseException } from "@/core/domain/common/exceptions";

export class InvalidOtpException extends BaseException {
  constructor() {
    super("$t:all.exception.invalid_otp", 401, "Error", "INVALID_OTP");
  }
}
