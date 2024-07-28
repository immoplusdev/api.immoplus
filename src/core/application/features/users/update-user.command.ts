import { OmitMethods } from '@/lib/ts-utilities';

export class UpdateUserCommand {
  constructor(data?: OmitMethods<UpdateUserCommand>) {
    if(data) Object.assign(this, data);
  }
}