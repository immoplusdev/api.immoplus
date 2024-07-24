import { BaseException } from './base.exception';

export class UnexpectedException extends BaseException {
  constructor() {
    super(
      `Nous avons rencontré une erreur inattendue lors de l'opération.`,
      500,
    );
  }
}
