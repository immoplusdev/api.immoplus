import { OmitMethods } from '@/lib/ts-utilities';

export class RegisterProEntrepriseCommand {
  email: string;
  phoneNumber: string;
  password: string;
  nomEntreprise: string;
  emailEntreprise: string;
  registreCommerceId: string;
  numeroContribuable: string
  typeEntreprise: string;
  constructor(data?: OmitMethods<RegisterProEntrepriseCommand>) {
    if(data) Object.assign(this, data);
  }
}
