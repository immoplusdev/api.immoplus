import { OmitMethods } from '@/lib/ts-utilities';

export class RegisterProEntrepriseCommandResponse {
  constructor(data?: OmitMethods<RegisterProEntrepriseCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
