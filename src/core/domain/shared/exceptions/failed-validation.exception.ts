import { BaseException } from '@/core/domain/shared/exceptions/base.exception';


export class FailedValidationException extends BaseException {
  constructor(message?: string) {
    super(message || '$t:all.exception.bad_request', 400);
  }
}
