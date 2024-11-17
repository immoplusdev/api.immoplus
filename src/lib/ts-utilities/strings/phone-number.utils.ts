export function sanitizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace("+", "").replace("-", "");
}

export function sanitizePhoneNumberIntl(phoneNumber: string): string {
  return `+${sanitizePhoneNumber(phoneNumber)}`;
}
