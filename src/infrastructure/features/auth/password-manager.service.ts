import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { IPasswordManagerService } from "@/core/domain/auth";


@Injectable()
export class PasswordManagerService implements IPasswordManagerService {
  encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  passwordMatchesHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
