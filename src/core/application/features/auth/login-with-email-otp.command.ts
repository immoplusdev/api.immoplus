import { OmitMethods } from '@/lib/ts-utilities';

export class LoginWithEmailOtpCommand {
  email: string;
  otp: string;
  constructor(data?: OmitMethods<LoginWithEmailOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}