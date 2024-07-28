import { OmitMethods } from '@/lib/ts-utilities';

export class CreateUserCommand {
  constructor(data?: OmitMethods<CreateUserCommand>) {
    if(data) Object.assign(this, data);
  }
}