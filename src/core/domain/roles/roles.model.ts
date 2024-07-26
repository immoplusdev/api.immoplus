import { OmitMethods } from "@/lib/ts-utilities";

export class Role {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  enforceTfa: boolean;
  appAccess: boolean;
  adminAccess: boolean;

  constructor(data?: OmitMethods<Role>) {
    if (data) Object.assign(this, data);
  }
}
