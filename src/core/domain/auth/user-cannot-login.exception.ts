import { BaseException } from "@/core/domain/shared/exceptions";

export class UserCannotLoginException extends BaseException {
  constructor() {
    super("USER_CANNOT_LOGIN", 401);
  }
}
