import { OmitMethods } from '@/lib/ts-utilities';

export class CreateDemandeVisiteCommandResponse {
  constructor(data?: OmitMethods<CreateDemandeVisiteCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
