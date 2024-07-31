import { OmitMethods } from '@/lib/ts-utilities';

export class SendEmailOtpCommand {
  email: string;
  constructor(data?: OmitMethods<SendEmailOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}