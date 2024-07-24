import { BaseException } from './base.exception';

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super(`USER_ALREADY_EXISTS`, 409);
  }
}
