import { SendMailParams } from "@/core/domain/notifications/send-mail-params.model";

export interface IMailService {
  sendMail(params: SendMailParams): Promise<void>;

  isMailServerAlive(): Promise<boolean>;
}
