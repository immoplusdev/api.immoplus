import { OmitMethods } from '@/lib/ts-utilities';
import { User } from "@/core/domain/users";

export class RegisterProParticulierCommandResponse {
  user: User;
  constructor(data?: OmitMethods<RegisterProParticulierCommandResponse>) {
    if(data) Object.assign(this, data);
  }
}
