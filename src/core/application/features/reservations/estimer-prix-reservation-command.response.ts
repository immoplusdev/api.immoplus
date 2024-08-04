import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixReservationCommandResponse {
  residence: string;
  datesReservation: ServiceDates;
  montantTotalReservation: number;
  montantReservationSansCommission: number;

  constructor(data?: OmitMethods<EstimerPrixReservationCommandResponse>) {
    if (data) Object.assign(this, data);
  }
}