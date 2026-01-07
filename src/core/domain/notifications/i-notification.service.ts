import {
  SendNotificationParams,
  SendBulkNotificationByRolesParams,
  BulkNotificationResult,
} from "./notification-service.model";

export interface INotificationService {
  sendNotification(params: SendNotificationParams): Promise<void>;
  sendBulkNotificationByRoles(
    params: SendBulkNotificationByRolesParams,
  ): Promise<BulkNotificationResult>;
}
