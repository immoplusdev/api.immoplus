import { OmitMethods } from '@/lib/ts-utilities';
import { UserStatus } from '@/core/domain/users/user-status.enum';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  language?: string;
  avatar?: string;
  verificationCode?: string;
  phoneNumber: string;
  otp?: string;
  country?: string;
  state?: string;
  city?: string;
  commune?: string;
  address?: string;
  address2?: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  currency?: string;
  authLoginAttempts: number;
  status: UserStatus;

  constructor(data?: OmitMethods<User>) {
    if (data) Object.assign(this, data);
  }
}
