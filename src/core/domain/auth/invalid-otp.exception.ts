import { BaseException } from "@/core/domain/shared/exceptions";

export class InvalidOtpException extends BaseException {
  constructor() {
    super("INVALID_OTP", 403);
  }
}
