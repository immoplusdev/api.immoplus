import { BaseException } from '../shared/exceptions/base.exception';

export class UserNotFoundException extends BaseException {
  constructor() {
    super(`$t:all.exception.user_not_found`, 404);
  }
}
