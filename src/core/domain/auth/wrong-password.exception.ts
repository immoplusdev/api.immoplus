import { BaseException } from "@/core/domain/shared/exceptions";

export class WrongPasswordException extends BaseException {
  constructor() {
    super("WRONG_PASSWORD", 409);
  }
}
