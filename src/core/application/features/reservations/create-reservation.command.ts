import { OmitMethods } from '@/lib/ts-utilities';
import { ServiceDates } from "@/core/domain/shared/models";

export class CreateReservationCommand {
  residence: string;
  datesReservation: ServiceDates;
  userId: string;
  clientPhoneNumber?: string;
  notes?: string;
  constructor(data?: OmitMethods<CreateReservationCommand>) {
    if(data) Object.assign(this, data);
  }
}