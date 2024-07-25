import { User } from '@/core/domain/users';
import { OmitMethods } from '@/lib/ts-utilities';

export class RegisterCommandResponse {
  user: User;
  constructor(data?: OmitMethods<RegisterCommandResponse>) {
    if (data) Object.assign(this, data);
  }
}