import { BaseException } from './base.exception';

export class ItemAlreadyValidatedException extends BaseException {
  constructor() {
    super(`Élement déjà validé`, 409);
  }
}
