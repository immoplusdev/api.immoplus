import { OmitMethods } from '@/lib/ts-utilities';

export class UpdatePasswordCommandResponse {
  constructor(data?: OmitMethods<UpdatePasswordCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
