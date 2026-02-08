export enum EmailTemplate {
  OTP = "otp",
  NEW_RESIDENCE_ADMIN = "new-residence-admin",
  WELCOME = "welcome",
  WELCOME_PRO = "welcome-pro",
}

export interface EmailTemplateData {
  [key: string]: any;
}

export interface IEmailTemplateService {
  render(template: EmailTemplate, data: EmailTemplateData): Promise<string>;
}
