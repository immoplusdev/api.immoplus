import { OmitMethods } from "@/lib/ts-utilities";
import { StatusDemandeVisite } from "./status-demande-visite.enum";
import { ServiceDates } from "@/core/domain/shared/models";
import { StatusFacture } from "@/core/domain/payments";
import { BienImmobilier } from "@/core/domain/biens-immobiliers";
import { TypeDemandeVisite } from "@/core/domain/demandes-visites";

export class DemandeVisite {
  id: string;
  bienImmobilier: BienImmobilier | string;
  bienImmobilierId?: string;
  statusDemandeVisite: StatusDemandeVisite;
  typeDemandeVisite: TypeDemandeVisite;
  datesDemandeVisite: ServiceDates;
  statusFacture: StatusFacture;
  retraitProEffectue: boolean;
  montantTotalDemandeVisite: number;
  montantDemandeVisiteSansCommission: number;
  notes: string;
  clientPhoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;

  constructor(data?: OmitMethods<DemandeVisite>) {
    if (data) Object.assign(this, data);
  }
}
