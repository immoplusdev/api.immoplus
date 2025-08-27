import { BaseException } from "@/core/domain/common/exceptions";

export class WrongPasswordException extends BaseException {
  constructor() {
    super(
      "$t:all.exception.wrong_password",
      401,
      "WRONG_PASSWORD",
      "WRONG_PASSWORD",
    );
  }
}
