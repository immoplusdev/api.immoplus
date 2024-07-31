import { BaseException } from '../shared/exceptions/base.exception';

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super(`$t:all.exception.user_already_exists`, 409);
  }
}
