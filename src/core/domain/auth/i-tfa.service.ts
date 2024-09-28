import { VerifyOtpOptions } from "./verify-otp-options.model";

export interface ITfaService {
  generateOtp(): string;
  generateUserOtp(userId: string): Promise<string>;
  generateUserPhoneNumberOtp(phoneNumber: string): Promise<string>;
  generateUserEmailOtp(email: string): Promise<string>;
  verifyUserOtp(userId: string, otp: string, options?:VerifyOtpOptions): Promise<boolean>;
  verifyUserEmailOtp(email: string, otp: string, options?:VerifyOtpOptions): Promise<boolean>;
  verifyUserPhoneNumberOtp(phoneNumber: string, otp: string, options?:VerifyOtpOptions): Promise<boolean>;
}
