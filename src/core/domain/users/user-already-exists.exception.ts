import { BaseException } from '../shared/exceptions/base.exception';

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super(`USER_ALREADY_EXISTS`, 409);
  }
}
