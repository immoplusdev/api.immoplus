import { OmitMethods } from "@/lib/ts-utilities";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { GeoJsonPoint } from "@/core/domain/map";
import { TypeResidence } from "./type-residence.enum";
import { Commodite } from "./commodite.model";
import { Piece } from "./piece.model";
import { User } from "@/core/domain/users";


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
  latitude?: number;
  longitude?: number;
  residenceDisponible: boolean;
  statusValidation: StatusValidationBienImmobilier;
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
    if (data) Object.assign(this, data);
  }
}

