import { OmitMethods } from "@/lib/ts-utilities";

export class UserOtp {
  id?: string;
  email: string;
  phoneNumber: string;
  otp: string;
  otpExpiration?: Date;
  isUsed: boolean;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data?: OmitMethods<UserOtp>) {
    if (data) Object.assign(this, data);
  }
}
