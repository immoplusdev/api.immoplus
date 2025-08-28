import { BaseException } from "./base.exception";

export class EmailNotFoundException extends BaseException {
  constructor() {
    super(
      `$t:all.exception.email_not_found`,
      401,
      "email_not_found",
      "EMAIL_NOT_FOUND",
    );
  }
}
