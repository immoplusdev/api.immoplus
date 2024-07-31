import { OmitMethods } from '@/lib/ts-utilities';

export class SendSmsOtpCommand {
  phoneNumber: string;
  constructor(data?: OmitMethods<SendSmsOtpCommand>) {
    if(data) Object.assign(this, data);
  }
}