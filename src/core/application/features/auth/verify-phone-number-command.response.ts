import { OmitMethods } from '@/lib/ts-utilities';

export class VerifyPhoneNumberCommandResponse {
  constructor(data?: OmitMethods<VerifyPhoneNumberCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
