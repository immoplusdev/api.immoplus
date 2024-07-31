import { OmitMethods } from '@/lib/ts-utilities';

export class SendSmsOtpCommandResponse {
  constructor(data?: OmitMethods<SendSmsOtpCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
