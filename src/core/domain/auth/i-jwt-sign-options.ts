export interface IJwtSignOptions {
  secret?: string | Buffer;
  privateKey?: string;
  expiresIn?: string | number | undefined;
}