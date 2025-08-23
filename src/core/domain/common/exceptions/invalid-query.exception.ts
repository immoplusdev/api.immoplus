import { BaseException } from "./base.exception";

export class InvalidQueryException extends BaseException {
  constructor() {
    super(`'$t:all.exception.bad_request'`, 400);
  }
}
