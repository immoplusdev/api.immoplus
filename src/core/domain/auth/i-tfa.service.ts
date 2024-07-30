export interface ITfaService {
  generateOtp(): string;
  generateUserOtp(userId: string): Promise<string>;
  generateUserPhoneNumberOtp(phoneNumber: string): Promise<string>;
  generateUserEmailOtp(email: string): Promise<string>;
  verifyUserOtp(userId: string, otp: string): Promise<boolean>;
}
