import { OmitMethods } from '@/lib/ts-utilities';

export class LoginWithPhoneNumberCommand {
  constructor(data?: OmitMethods<LoginWithPhoneNumberCommand>) {
    if(data) Object.assign(this, data);
  }
}