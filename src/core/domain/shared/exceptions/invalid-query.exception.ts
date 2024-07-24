import { BaseException } from './base.exception';

export class InvalidQueryException extends BaseException {
  constructor() {
    super(`Requête invalide`, 400);
  }
}
