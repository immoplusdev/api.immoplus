import { OmitMethods } from '@/lib/ts-utilities';

export class RegisterProEntrepriseCommand {
  // firstName: string;
  // lastName: string;
  city?: string;
  email: string;
  phoneNumber: string;
  password: string;
  nomEntreprise: string;
  emailEntreprise: string;
  registreCommerce: string;
  numeroContribuable: string
  typeEntreprise: string;
  constructor(data?: OmitMethods<RegisterProEntrepriseCommand>) {
    if(data) Object.assign(this, data);
  }
}
