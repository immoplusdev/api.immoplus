import { OmitMethods } from '@/lib/ts-utilities';

export class UpdateUserAdditionalDataCommandResponse {
  // Pro particulier
  lieuNaissance: string;
  activite: string;
  photoIdentite: string;
  pieceIdentite: string;

  // Pro entreprise
  nomEntreprise: string;
  emailEntreprise: string;
  registreCommerce: string;
  numeroContribuable: string;
  typeEntreprise: string;
  constructor(data?: OmitMethods<UpdateUserAdditionalDataCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
