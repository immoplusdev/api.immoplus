import { OmitMethods } from "@/lib/ts-utilities";
import { UserRole } from "@/core/domain/roles";
import { PushNotificationType } from "./notification-type.enum";

export class SendNotificationParams {
  userId: string;
  subject: string;
  message: string;
  skipInAppNotification?: boolean;
  sendMail?: boolean;
  sendSms?: boolean;
  htmlMessage?: string;
  returnUrl?: string;
  data?: Record<string, any>;
  url?: string;

  constructor(data?: OmitMethods<SendNotificationParams>) {
    if (data) Object.assign(this, data);
  }
}

export class SendBulkNotificationByRolesParams {
  roles: UserRole[];
  subject: string;
  message: string;
  data?: Record<string, any>;
  url?: string;
  type?: PushNotificationType;
  imageUrl?: string;

  constructor(data?: OmitMethods<SendBulkNotificationByRolesParams>) {
    if (data) Object.assign(this, data);
  }
}

export class SendEmailNotificationParams {
  email: string;
  subject: string;
  message: string;

  constructor(data?: OmitMethods<SendEmailNotificationParams>) {
    if (data) Object.assign(this, data);
  }
}

export class SendSmsNotificationParams {
  phoneNumber: string;
  subject: string;
  message: string;

  constructor(data?: OmitMethods<SendSmsNotificationParams>) {
    if (data) Object.assign(this, data);
  }
}

export interface OneSignalResponse {
  id: string;
  recipients: number;
  external_id?: string;
  errors?: {
    invalid_external_user_ids?: string[];
    invalid_player_ids?: string[];
  };
}

export interface BulkNotificationResult {
  totalTargeted: number;
  successful: number;
  failed: number;
  errors?: Array<{
    userId: string;
    error: string;
  }>;
}
