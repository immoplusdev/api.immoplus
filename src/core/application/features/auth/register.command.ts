import { OmitMethods } from '@/lib/ts-utilities';

export class RegisterCommand {
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  phoneNumber: string;
  password: string;
  constructor(data?: OmitMethods<RegisterCommand>) {
    Object.assign(this, data);
  }
}
