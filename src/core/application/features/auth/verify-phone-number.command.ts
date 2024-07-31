import { OmitMethods } from '@/lib/ts-utilities';

export class VerifyPhoneNumberCommand {
  phoneNumber: string;
  otp: string;
  constructor(data?: OmitMethods<VerifyPhoneNumberCommand>) {
    if(data) Object.assign(this, data);
  }
}