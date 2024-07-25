export interface IJwtManagerService {
  generateAccessToken(payload: any): string;

  generateRefresh(payload: any): string;
}

export interface JwtSignOptions {
  secret?: string | Buffer;
  privateKey?: string;
  expiresIn?: string | number | undefined;
}
