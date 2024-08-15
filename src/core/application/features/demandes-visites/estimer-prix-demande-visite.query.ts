import { OmitMethods } from "@/lib/ts-utilities";
import { ServiceDates } from "@/core/domain/shared/models";

export class EstimerPrixDemandeVisiteQuery {
  bienImmobilier: string;
  typeDemandeVisite: string;
  datesDemandeVisite: ServiceDates;

  constructor(data?: OmitMethods<EstimerPrixDemandeVisiteQuery>) {
    if (data) Object.assign(this, data);
  }
}
