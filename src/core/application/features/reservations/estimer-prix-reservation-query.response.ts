import { OmitMethods } from '@/lib/ts-utilities';
import { ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixReservationQueryResponse {
  residence: string;
  datesReservation: ServiceDates;
  montantTotalReservation: number;
  montantReservationSansCommission: number;
  constructor(data?: OmitMethods<EstimerPrixReservationQueryResponse>) {
    if(data) Object.assign(this, data);
  }
}
