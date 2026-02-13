import { OmitMethods } from "@/lib/ts-utilities";
import { GeoJsonPoint } from "@/core/domain/map";
import { FurnitureStatus } from "./furniture-status.enum";

export class Furniture {
  id: string;
  owner: string;
  ownerId?: string;
  ville?: string;
  commune?: string;
  adresse: string;
  position?: GeoJsonPoint;
  lat?: number;
  lng?: number;
  titre: string;
  description: string;
  prix: number;
  images?: string[];
  video?: string;
  viewsCount: number;
  status: FurnitureStatus;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;

  constructor(data?: OmitMethods<Furniture>) {
    if (data) Object.assign(this, data);
    if (!this.owner && this.ownerId) this.owner = this.ownerId;
    if (!this.ownerId && this.owner) this.ownerId = this.owner;
  }
}
