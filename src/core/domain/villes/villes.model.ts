import { OmitMethods } from "@/lib/ts-utilities";

export class Ville {
  id: string;
  name: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  constructor(data?: OmitMethods<Ville>) {
    if (data) Object.assign(this, data);
  }
}
