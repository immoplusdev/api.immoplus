import { OmitMethods } from "@/lib/ts-utilities";

export class Commune {
  id: string;
  name: string;
  ville: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  constructor(data?: OmitMethods<Commune>) {
    if (data) Object.assign(this, data);
  }
}
