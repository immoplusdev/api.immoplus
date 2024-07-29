import { BaseException } from "@/core/domain/shared/exceptions";

export class AccountDataAlreadyVerifiedException extends BaseException {
  constructor() {
    super("ACCOUNT_DATA_ALREADY_VERIFIED", 409);
  }
}
