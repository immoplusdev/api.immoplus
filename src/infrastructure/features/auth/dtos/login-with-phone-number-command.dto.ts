import { OmitMethods } from '@/lib/ts-utilities';

export class LoginWithPhoneNumberCommandDto {
  constructor(data?: OmitMethods<LoginWithPhoneNumberCommandDto>) {
    Object.assign(this, data);
  }
}
