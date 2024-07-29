import { OmitMethods } from "@/lib/ts-utilities";
import { UserRole } from "./user-role.enum";

export class Role {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  enforceTfa: boolean;
  appAccess: boolean;
  adminAccess: boolean;
  hasAdminAccess(){
    return this.adminAccess || this.id == UserRole.Admin;
  }
  constructor(data?: OmitMethods<Role>) {
    if (data) Object.assign(this, data);
  }
}
