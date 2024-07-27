import { OmitMethods } from '@/lib/ts-utilities';

export class RegisterProParticulierCommand {
  firstName: string;
  lastName: string;
  city?: string;
  email: string;
  phoneNumber: string;
  password: string;
  activite: string;
  photoIdentite: string;
  pieceIdentite: string;
  constructor(data?: OmitMethods<RegisterProParticulierCommand>) {
    if(data) Object.assign(this, data);
  }
}