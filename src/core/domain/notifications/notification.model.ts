import { OmitMethods } from "@/lib/ts-utilities";
import { NotificationType } from "@/core/domain/notifications/notification-type.enum";

export class Notification {
  id: string;
  type: NotificationType;
  subject: string;
  message?: string;
  collection?: string;
  item?: string;
  recipient?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  constructor(data?: OmitMethods<Notification>) {
    if (data) Object.assign(this, data);
  }
}
