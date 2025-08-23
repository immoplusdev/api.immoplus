import { BaseException } from "./base.exception";

export class ConflictException extends BaseException {
  constructor(message?: string) {
    super(message || "$t:all.exception.something_went_wrong", 409);
  }
}
