import { OmitMethods } from "@/lib/ts-utilities";
import { UserStatus } from "@/core/domain/users/user-status.enum";
import { UserData } from "@/core/domain/users/users-data.model";
import { Role } from "@/core/domain/roles";

export class User {
  // basic fields
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  phoneNumberVerified: boolean;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date;

  constructor(data?: OmitMethods<User>) {
    if (data) Object.assign(this, data);
  }
}
