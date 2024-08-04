import { OmitMethods } from '@/lib/ts-utilities';

export class EstimerPrixReservationQuery {
  constructor(data?: OmitMethods<EstimerPrixReservationQuery>) {
    if(data) Object.assign(this, data);
  }
}
