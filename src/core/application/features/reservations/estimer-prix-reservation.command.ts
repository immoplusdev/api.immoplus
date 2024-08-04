import { OmitMethods } from '@/lib/ts-utilities';
import { ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixReservationCommand {
  residence: string;
  datesReservation: ServiceDates;
  constructor(data?: OmitMethods<EstimerPrixReservationCommand>) {
    if(data) Object.assign(this, data);
  }
}