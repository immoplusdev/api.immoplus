import { IBaseRepository } from "@/core/domain/common/repositories";
import {
  Notification,
  SendNotificationParams,
} from "@/core/domain/notifications";

export interface INotificationRepository extends IBaseRepository<
  Notification,
  Partial<Notification>,
  Partial<Notification>
> {
  sendTestNotification(params: SendNotificationParams): Promise<string>;
}
