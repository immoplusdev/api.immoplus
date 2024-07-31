import { BaseException } from '../shared/exceptions/base.exception';

export class UnauthorizedException extends BaseException {
  constructor() {
    super(`$t:all.exception.unauthorized`, 401);
  }
}
//Unauthorized