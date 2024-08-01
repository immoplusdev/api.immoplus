import { User } from "@/core/domain/users";

export class LoginWithPhoneNumberOtpCommandResponse {
  accessToken: string;
  expires: string;
  refreshToken: string;
  user: User;
}
