import { OmitMethods } from '@/lib/ts-utilities';

export class UpdateUserCommandResponse {
  constructor(data?: OmitMethods<UpdateUserCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
