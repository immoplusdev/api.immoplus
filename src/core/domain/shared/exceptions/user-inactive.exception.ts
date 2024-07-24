import { BaseException } from './base.exception';

export class UserInactiveException extends BaseException {
  constructor() {
    super(
      `Votre compte n'est pas activé. Veuillez contacter l'admnistrateur.`,
      403,
    );
  }
}
