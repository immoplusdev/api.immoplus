import { BaseException } from "@/core/domain/common/exceptions";

export class AccountDataAlreadyVerifiedException extends BaseException {
  constructor() {
    super("$t:all.exception.account_data_already_verified", 409);
  }
}
