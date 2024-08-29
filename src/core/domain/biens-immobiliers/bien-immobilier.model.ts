import { OmitMethods } from "@/lib/ts-utilities";
import { GeoJsonPoint } from "@/core/domain/map";
import {
  StatusValidationBienImmobilier,
  TypeBienImmobilier,
  Amentity,
  TypeLocationBienImmobilier,
} from "@/core/domain/biens-immobiliers";
import { File } from "@/core/domain/files";

export class BienImmobilier {
  id: string;
  miniature: File | string;
  miniatureId: string;
  nom: string;
  typeBienImmobilier: TypeBienImmobilier;
  description: string;
  typeLocation: TypeLocationBienImmobilier;
  aLouer: boolean;

  amentities?: Amentity[];
  tags?: string[];
  images?: string[];
  video?: string;
  ville?: string;
  commune?: string;
  adresse?: string;
  position?: GeoJsonPoint;

  statusValidation: StatusValidationBienImmobilier;
  prix: number;
  metadata?: Record<string, any>;
  featured: boolean;

  nombreMaxOccupants: number;

  animauxAutorises: boolean;

  bienImmobilierDisponible: boolean;

  fetesAutorises: boolean;

  reglesSupplementaires?: string;

  proprietaire?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  createdBy?: string;

  constructor(data?: Partial<OmitMethods<BienImmobilier>>) {
    if (data) Object.assign(this, data);
  }
}
