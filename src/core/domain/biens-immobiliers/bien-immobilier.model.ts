import { OmitMethods } from "@/lib/ts-utilities";
import { GeoJsonPoint } from "@/core/domain/map";
import {
  StatusValidationBienImmobilier,
  TypeBienImmobilier,
  Amentity,
  TypeLocationBienImmobilier,
} from "@/core/domain/biens-immobiliers";
import { Piece } from "./piece.model";
import { Ville } from "@/core/domain/villes";
import { Commune } from "@/core/domain/communes";

export class BienImmobilier {
  id: string;
  miniature: string;
  nom: string;
  typeBienImmobilier: TypeBienImmobilier;
  description: string;
  typeLocation: TypeLocationBienImmobilier;
  pieces?: Piece[];
  aLouer: boolean;
  amentities?: Amentity[];
  tags?: string[];
  images?: string[];
  video?: string;
  ville?: string;
  commune?: string;
  ville_model?: Ville;
  commune_model?: Commune;
  adresse?: string;
  position?: GeoJsonPoint;
  latitude?: number;
  longitude?: number;
  statusValidation: StatusValidationBienImmobilier;
  prix: number;
  metadata?: Record<string, any>;
  featured: boolean;
  nombreMaxOccupants: number;
  animauxAutorises: boolean;
  bienImmobilierDisponible: boolean;
  fetesAutorises: boolean;
  reglesSupplementaires?: string;
  score: number;
  proprietaire?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;

  constructor(data?: Partial<OmitMethods<BienImmobilier>>) {
    if (data) Object.assign(this, data);
  }
}
