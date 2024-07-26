import { OmitMethods } from '@/lib/ts-utilities';
import { User } from "./users.model";

export class UserData {
  id: string;
  user?: User | string;
  lieuNaissance?: string;
  activite?: string;
  photoIdentite?: string;
  pieceIdentite?: string;

  // Pro entreprise
  nomEntreprise?: string;
  emailEntreprise?: string;
  registreCommerce?: string;
  numeroContribuable?: string;
  typeEntreprise?: string;

  constructor(data?: OmitMethods<UserData>) {
    if(data) Object.assign(this, data);
  }
}
