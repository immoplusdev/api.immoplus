import { OmitMethods } from '@/lib/ts-utilities';

export class GetDemandeVisiteByIdQuery {
  bienImmobilierId: string;
  constructor(data?: OmitMethods<GetDemandeVisiteByIdQuery>) {
    if(data) Object.assign(this, data);
  }
}
