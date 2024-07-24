import { User } from '@/core/domain/users';
import { OmitMethods } from '@/lib/ts-utilities';

export class LoginResponse {
  accessToken: string;
  expires: string;
  refreshToken: string;
  user: User;
  constructor(data?: OmitMethods<LoginResponse>) {
    if (data) Object.assign(this, data);
  }
}
