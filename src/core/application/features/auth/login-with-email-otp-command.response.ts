import { OmitMethods } from '@/lib/ts-utilities';
import { User } from "@/core/domain/users";

export class LoginWithEmailOtpCommandResponse {
  accessToken: string;
  expires: string;
  refreshToken: string;
  user: User;
  constructor(data?: OmitMethods<LoginWithEmailOtpCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
