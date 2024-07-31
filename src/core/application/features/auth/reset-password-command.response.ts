import { OmitMethods } from '@/lib/ts-utilities';

export class ResetPasswordCommandResponse {
  constructor(data?: OmitMethods<ResetPasswordCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
