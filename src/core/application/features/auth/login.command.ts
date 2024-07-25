import { OmitMethods } from '@/lib/ts-utilities';

export class LoginCommand {
  username: string;
  password: string;
  constructor(data?: OmitMethods<LoginCommand>) {
    if(data) Object.assign(this, data);
  }
}