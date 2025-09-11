import { BaseException } from "./base.exception";

export class UnexpectedException extends BaseException {
  constructor(message: string =`$t:all.exception.something_went_wrong`) {
    super(message, 500);
  }
}
