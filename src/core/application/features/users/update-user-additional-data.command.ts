import { OmitMethods } from '@/lib/ts-utilities';
import { User } from "@/core/domain/users";

export class UpdateUserAdditionalDataCommand {
  userId: string;
  // Pro particulier
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

  constructor(data?: OmitMethods<UpdateUserAdditionalDataCommand>) {
    if(data) Object.assign(this, data);
  }
}