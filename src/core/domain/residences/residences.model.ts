import { OmitMethods } from '@/lib/ts-utilities';
import { TypeResidence } from "@/core/domain/residences/type-residence.enum";
import { Commodite } from "@/core/domain/residences/commodite.model";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";
import { StatusValidationResidence } from "@/core/domain/residences/status-validation-residence.enum";

export class Residence {
  id: string;
  miniature: string;
  nom: string;
  typeResidence: TypeResidence;
  description: string;
  commodites?: Commodite[];
  pieces?: Piece[];
  images?: string[];
  video?: string;
  ville?: string;
  commune?: string;
  adresse?: string;
  position?: GeoJsonPoint;
  residenceDisponible: boolean;
  statusValidation: StatusValidationResidence;
  prixReservation: number;
  dureeMinSejour: number;
  dureeMaxSejour: number;
  metadata?: Record<string, any>;
  heureEntree: string;
  heureDepart: string;
  nombreMaxOccupants: number;
  animauxAutorises: boolean;
  fetesAutorises: boolean;
  reglesSupplementaires?: string;
  proprietaire?: string;

  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
  constructor(data?: OmitMethods<Residence>) {
    if(data) Object.assign(this, data);
  }
}

