import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";

export class CreateDemandeVisiteCommand {
  bienImmobilier: string;
  typeDemandeVisite: TypeDemandeVisite;
  datesDemandeVisite: ServiceDates;
  userId: string;
  clientPhoneNumber: string;
  notes: string;

  constructor(data?: OmitMethods<CreateDemandeVisiteCommand>) {
    if (data) Object.assign(this, data);
  }
}