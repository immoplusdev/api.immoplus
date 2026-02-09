export enum EmailTemplate {
  OTP = "otp",
  NEW_RESIDENCE_ADMIN = "new-residence-admin",
  WELCOME = "welcome",
  WELCOME_PRO = "welcome-pro",
  VISITE_CONFIRMEE = "visite-confirmee",
  NOUVELLE_DEMANDE_VISITE = "nouvelle-demande-visite",
  PAIEMENT_RESERVATION_CONFIRME = "paiement-reservation-confirme",
  PAIEMENT_RESERVATION_RECU_PRO = "paiement-reservation-recu-pro",
  PAIEMENT_RESERVATION_ADMIN = "paiement-reservation-admin",
  VISITE_EXPRESS_PAYEE_PRO = "visite-express-payee-pro",
  VISITE_EXPRESS_PAYEE_CLIENT = "visite-express-payee-client",
  RETRAIT_WALLET_PRO = "retrait-wallet-pro",
  NOUVELLE_DEMANDE_RETRAIT_ADMIN = "nouvelle-demande-retrait-admin",
  SOLDE_DISPONIBLE_PRO = "solde-disponible-pro",
}

export interface EmailTemplateData {
  [key: string]: any;
}

export interface IEmailTemplateService {
  render(template: EmailTemplate, data: EmailTemplateData): Promise<string>;
}
