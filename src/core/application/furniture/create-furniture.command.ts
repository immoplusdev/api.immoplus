import { OmitMethods } from "@/lib/ts-utilities";
import { GeoJsonPoint } from "@/core/domain/map";
import { FurnitureStatus } from "@/core/domain/furniture";

export class CreateFurnitureCommand {
  ownerId: string;
  titre: string;
  description: string;
  prix: number;
  adresse: string;
  ville?: string;
  commune?: string;
  position?: GeoJsonPoint;
  lat?: number;
  lng?: number;
  images?: string[];
  video?: string;
  status?: FurnitureStatus;
  metadata?: Record<string, any>;
  constructor(data?: OmitMethods<CreateFurnitureCommand>) {
    if (data) Object.assign(this, data);
  }
}
