import { OmitMethods } from "@/lib/ts-utilities";
import { StatusReservation } from "@/core/domain/reservations/status-reservation.enum";
import { ServiceDates } from "@/core/domain/shared/models";
import { StatusFacture } from "@/core/domain/payments";
import { Residence } from "@/core/domain/residences";

export class Reservation {
  id: string;
  residence: Residence | string;
  residenceId: string;
  statusReservation: StatusReservation;
  datesReservation: ServiceDates;
  statusFacture: StatusFacture;
  retraitProEffectue: boolean;
  montantTotalReservation: number;
  montantReservationSansCommission: number;
  notes: string;
  clientPhoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  // deletedAt?: Date;

  createdBy?: string;
  // updatedBy?: string;
  // deletedBy?: string;
  constructor(data?: OmitMethods<Reservation>) {
    if (data) Object.assign(this, data);
  }
}
