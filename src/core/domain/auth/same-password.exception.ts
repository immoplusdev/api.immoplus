import { BaseException } from "@/core/domain/common/exceptions";

export class SamePasswordException extends BaseException {
  constructor() {
    super(
      "$t:all.exception.same_password",
      401,
      "WRONG_PASSWORD",
      "WRONG_PASSWORD",
    );
  }
}
