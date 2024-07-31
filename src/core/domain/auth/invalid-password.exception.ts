import { BaseException } from '../shared/exceptions/base.exception';

export class InvalidPasswordException extends BaseException {
  constructor() {
    super(`INVALID_PASSWORD`, 401);
  }
}
