export interface IJwtManagerService {
  generateAccessToken(payload: any): string;

  generateRefreshToken(payload: any): string;
}

export interface JwtSignOptions {
  secret?: string | Buffer;
  privateKey?: string;
  expiresIn?: string | number | undefined;
}
