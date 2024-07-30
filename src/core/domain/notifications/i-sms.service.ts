export interface ISmsService {
  sendSms(recipients: Array<string>, message: string): Promise<void>;
}
