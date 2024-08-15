import { OmitMethods } from '@/lib/ts-utilities';
import { ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixReservationQuery {
  residence: string;
  datesReservation: ServiceDates;

  constructor(data?: OmitMethods<EstimerPrixReservationQuery>) {
    if(data) Object.assign(this, data);
  }
}
