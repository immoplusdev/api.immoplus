import { OmitMethods } from '@/lib/ts-utilities';

export class VerifyEmailCommandResponse {
  constructor(data?: OmitMethods<VerifyEmailCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
