import { OmitMethods } from "@/lib/ts-utilities";
import { GeoJsonPoint } from "@/core/domain/map";
import { FurnitureStatus } from "@/core/domain/furniture";
import { FurnitureMetadata } from "@/core/domain/furniture/furniture-metadata";

export class CreateFurnitureCommand {
  ownerId: string;
  titre: string;
  description: string;
  prix: number;
  type: string;
  category: string;
  etat: "neuf" | "reconditionne" | "occasion";
  adresse: string;
  ville?: string;
  commune?: string;
  position?: GeoJsonPoint;
  lat?: number;
  lng?: number;
  images?: string[];
  video?: string;
  status?: FurnitureStatus;
  metadata?: FurnitureMetadata;
  constructor(data?: OmitMethods<CreateFurnitureCommand>) {
    if (data) Object.assign(this, data);
  }
}
