import { OmitMethods } from '@/lib/ts-utilities';
import { Role } from "@/core/domain/roles";
import { PermissionCollection } from "@/core/domain/permissions/permission-collection.enum";
import { PermissionAction } from "@/core/domain/permissions/permission-action.enum";

export class Permission {
  id: string;
  role: Role | string;
  collectionName: PermissionCollection;
  action: PermissionAction;
  fields?: string[];
  constructor(data?: OmitMethods<Permission>) {
    if(data) Object.assign(this, data);
  }
}
