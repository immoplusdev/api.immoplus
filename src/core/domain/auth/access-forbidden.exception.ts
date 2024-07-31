import { BaseException } from '../shared/exceptions/base.exception';

export class AccessForbiddenException extends BaseException {
  constructor() {
    super(`$t:exception.access_forbidden`, 403);
  }
}