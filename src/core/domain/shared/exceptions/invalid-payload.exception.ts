import { BaseException } from '@/core/domain/shared/exceptions/base.exception';

export class InvalidPayloadException extends BaseException {
  constructor() {
    super('INVALID_PAYLOAD', 400);
  }
}
