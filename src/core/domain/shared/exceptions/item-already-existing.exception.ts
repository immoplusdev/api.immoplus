import { BaseException } from './base.exception';

export class ItemAlreadyExistingException extends BaseException {
  constructor() {
    super(`Élement déjà créé`, 409);
  }
}
