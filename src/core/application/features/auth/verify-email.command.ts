import { OmitMethods } from '@/lib/ts-utilities';

export class VerifyEmailCommand {
  email: string;
  otp: string;
  constructor(data?: OmitMethods<VerifyEmailCommand>) {
    if(data) Object.assign(this, data);
  }
}