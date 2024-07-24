import { BaseException } from '@/core/domain/shared/exceptions';

export class UserPhoneNumberAlreadyTakenException extends BaseException {
  constructor() {
    super(`Le numéro de téléphon est déjà utilisée par un autre utilisateur`, 409);
  }
}
