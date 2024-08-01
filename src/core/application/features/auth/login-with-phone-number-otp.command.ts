import { OmitMethods } from '@/lib/ts-utilities';

export class LoginWithPhoneNumberOtpCommand {
  phoneNumber: string;
  otp: string;
  constructor(data?: OmitMethods<LoginWithPhoneNumberOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}