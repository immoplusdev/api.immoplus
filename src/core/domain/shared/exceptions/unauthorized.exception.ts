import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor() {
    super(`ACCESS_FORBIDDEN`, 401);
  }
}
