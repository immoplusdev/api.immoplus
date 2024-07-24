import { BaseException } from '@/core/domain/shared/exceptions/base.exception';


export class FailedValidationException extends BaseException {
  constructor(message?: string) {
    super(message || 'BAD_REQUEST', 400);
  }
}
