import { OmitMethods } from "@/lib/ts-utilities";
import { Role } from "@/core/domain/roles";
import { UserStatus } from "./user-status.enum";
import { UserData } from "./user-data.model";

export class User {
  // basic fields
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;

  // Social auth data
  googleId?: string;
  facebookId?: string;
  appleId?: string;

  role: Role | string;
  language?: string;
  avatar?: string;
  phoneNumber: string;
  otp?: string;
  otpExpiration?: Date;

  // User Data
  country?: string;
  state?: string;
  city?: string;
  commune?: string;
  address?: string;
  address2?: string;
  currency?: string;
  additionalData?: UserData | string;

  // Status and Dates
  authLoginAttempts: number;
  emailVerified: boolean;
  identityVerified: boolean;
  phoneNumberVerified: boolean;
  compteProValide: boolean;
  status: UserStatus;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  clearPrivateCredentials() {
    if (this.password) {
      this.password = "********";
    }
    return this;
  }

  constructor(data?: OmitMethods<User>) {
    if (data) Object.assign(this, data);
  }
}
