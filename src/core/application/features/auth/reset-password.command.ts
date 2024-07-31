import { OmitMethods } from '@/lib/ts-utilities';

export class ResetPasswordCommand {
  username: string;
  otp: string;
  newPassword: string;
  constructor(data?: OmitMethods<ResetPasswordCommand>) {
    if(data) Object.assign(this, data);
  }
}