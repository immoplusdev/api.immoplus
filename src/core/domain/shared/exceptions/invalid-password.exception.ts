import { BaseException } from './base.exception';

export class InvalidPasswordException extends BaseException {
  constructor() {
    super(`INVALID_PASSWORD`, 401);
  }
}
