import { BaseException } from './base.exception';

export class AccessForbiddenException extends BaseException {
  constructor() {
    super(`ACCESS_FORBIDDEN`, 403);
  }
}