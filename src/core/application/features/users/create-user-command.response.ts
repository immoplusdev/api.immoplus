import { OmitMethods } from '@/lib/ts-utilities';

export class CreateUserCommandResponse {
  constructor(data?: OmitMethods<CreateUserCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
