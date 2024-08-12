import { OmitMethods } from '@/lib/ts-utilities';

export class RegisterProParticulierCommand {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  activite: string;
  photoIdentiteId: string;
  pieceIdentiteId: string;
  constructor(data?: OmitMethods<RegisterProParticulierCommand>) {
    if(data) Object.assign(this, data);
  }
}