import { BaseException } from '../shared/exceptions/base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(`$t:all.exception.invalid_crendentials`, 401);
  }
}
