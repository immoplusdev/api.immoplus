import { SendNotificationParams } from "./notification-service.model";

export interface INotificationService {
  sendNotification(params: SendNotificationParams): Promise<void>;
}
