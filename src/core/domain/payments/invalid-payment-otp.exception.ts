import { BaseException } from "@/core/domain/shared/exceptions";

export class InvalidPaymentOtpException extends BaseException {
  constructor() {
    super("$t:all.exception.invalid_payment_otp_exception", 400);
  }
}
