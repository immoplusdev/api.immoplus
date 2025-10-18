import { OmitMethods } from "@/lib/ts-utilities";
import { StatusReservation } from "./status-reservation.enum";
import { ServiceDates } from "@/core/domain/common/models";
import { StatusFacture } from "@/core/domain/payments";
import { Residence } from "@/core/domain/residences";

export class Reservation {
  id: string;
  residence: Residence | string;
  statusReservation: StatusReservation;
  datesReservation: ServiceDates;
  dateDebut: Date;
  dateFin: Date;
  statusFacture: StatusFacture;
  retraitProEffectue: boolean;
  proReverse?: boolean;
  montantTotalReservation: number;
  montantCommission: number;
  montantPaye: number;
  notes: string;
  clientPhoneNumber: string;
  codeReservation: string;
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
