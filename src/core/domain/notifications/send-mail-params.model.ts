import { OmitMethods } from "@/lib/ts-utilities";

export class SendMailParams {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;

  constructor(data?: OmitMethods<SendMailParams>) {
    if (data) Object.assign(this, data);
  }
}

