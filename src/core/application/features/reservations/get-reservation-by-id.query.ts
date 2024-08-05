import { OmitMethods } from '@/lib/ts-utilities';

export class GetReservationByIdQuery {
  id: string;
  constructor(data?: OmitMethods<GetReservationByIdQuery>) {
    if(data) Object.assign(this, data);
  }
}
