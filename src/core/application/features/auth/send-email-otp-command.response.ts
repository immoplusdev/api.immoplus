import { OmitMethods } from '@/lib/ts-utilities';

export class SendEmailOtpCommandResponse {
  constructor(data?: OmitMethods<SendEmailOtpCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
