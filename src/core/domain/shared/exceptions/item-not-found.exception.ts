import { BaseException } from './base.exception';

export class ItemNotFoundException extends BaseException {
  constructor() {
    super(`Élement introuvable`, 404);
  }
}
