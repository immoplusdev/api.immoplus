import { OmitMethods } from '@/lib/ts-utilities';

export class AnnulerReservationByIdCommand {
  reservationId: string;
  userId: string;
  notes?: string;
  constructor(data?: OmitMethods<AnnulerReservationByIdCommand>) {
    if(data) Object.assign(this, data);
  }
}