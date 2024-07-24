import { BaseException } from './base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(`Mauvais nom d'utilisateur ou mot de passe`, 401);
  }
}
