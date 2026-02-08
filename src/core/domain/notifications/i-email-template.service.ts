export enum EmailTemplate {
  OTP = "otp",
}

export interface EmailTemplateData {
  [key: string]: any;
}

export interface IEmailTemplateService {
  render(template: EmailTemplate, data: EmailTemplateData): Promise<string>;
}
