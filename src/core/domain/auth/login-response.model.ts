import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "@/core/domain/users";

export class LoginResponse {
  accessToken: string;
  expires: string;
  refreshToken: string;
  user: User;

  constructor(data?: OmitMethods<LoginResponse>) {
    if (data) Object.assign(this, data);
  }
}