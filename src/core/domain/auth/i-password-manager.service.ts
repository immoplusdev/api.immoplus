export interface IPasswordManagerService {
  encryptPassword(password: string): string;

  passwordMatchesHash(password: string, hash: string): boolean;
}
