import { OmitMethods } from '@/lib/ts-utilities';

export class UpdatePasswordCommand {
  userId: string;
  oldPassword: string;
  newPassword: string;
  constructor(data?: OmitMethods<UpdatePasswordCommand>) {
    if(data) Object.assign(this, data);
  }
}