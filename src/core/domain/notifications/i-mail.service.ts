import { SendMailParams } from "./send-mail-params.model";

export interface IMailService {
  sendMail(params: SendMailParams): Promise<void>;

  isMailServerAlive(): Promise<boolean>;
}
