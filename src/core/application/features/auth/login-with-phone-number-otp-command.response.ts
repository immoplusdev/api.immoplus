import { User } from "@/core/domain/users";

export class LoginWithPhoneNumberOtpCommandResponse {
  accessToken: string;
  expires: string;
  refreshToken: string;
  user: User;

  constructor(data?: LoginWithPhoneNumberOtpCommandResponse) {
    if (data) Object.assign(this, data);
  }
}
