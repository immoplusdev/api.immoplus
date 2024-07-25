import { OmitMethods } from '@/lib/ts-utilities';

export class LoginWithPhoneNumberCommandResponse {
  constructor(data?: OmitMethods<LoginWithPhoneNumberCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
