import { OmitMethods } from '@/lib/ts-utilities';

export class GetBienImmobilierOccupiedDatesQuery {
  bienImmobilierId: string;
  constructor(data?: OmitMethods<GetBienImmobilierOccupiedDatesQuery>) {
    if(data) Object.assign(this, data);
  }
}
