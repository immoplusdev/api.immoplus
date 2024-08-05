import { OmitMethods } from '@/lib/ts-utilities';

export class PublicUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  constructor(data?: OmitMethods<PublicUserInfo>) {
    if(data) Object.assign(this, data);
  }
}
