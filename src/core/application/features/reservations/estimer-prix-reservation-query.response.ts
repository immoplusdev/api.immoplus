import { OmitMethods } from '@/lib/ts-utilities';

export class EstimerPrixReservationQueryResponse {
  constructor(data?: OmitMethods<EstimerPrixReservationQueryResponse>) {
    if(data) Object.assign(this, data);
  }
}
