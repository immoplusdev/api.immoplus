export interface ISmsServiceService {
  sendSms(recipients: Array<string>, message: string): Promise<void>;
}
