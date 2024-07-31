import { BaseException } from "@/core/domain/shared/exceptions";

export class AccountDataAlreadyVerifiedException extends BaseException {
  constructor() {
    super("$t:all.exception.account_data_already_verified", 409);
  }
}
