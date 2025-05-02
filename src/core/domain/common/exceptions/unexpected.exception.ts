import { BaseException } from './base.exception';

export class UnexpectedException extends BaseException {
  constructor() {
    super(
      `$t:all.exception.something_went_wrong`,
      500,
    );
  }
}
