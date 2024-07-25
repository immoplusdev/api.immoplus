import { OmitMethods } from '@/lib/ts-utilities';
import { User } from "@/core/domain/users";

export class LoginCommandResponse {
  accessToken: string;
  expires: string;
  refreshToken: string;
  user: User;
  constructor(data?: OmitMethods<LoginCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
