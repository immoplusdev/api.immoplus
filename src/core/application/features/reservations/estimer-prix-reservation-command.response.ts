import { OmitMethods } from '@/lib/ts-utilities';

export class EstimerPrixReservationCommandResponse {
  constructor(data?: OmitMethods<EstimerPrixReservationCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
