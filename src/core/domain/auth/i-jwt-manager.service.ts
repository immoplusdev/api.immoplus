export interface IJwtManagerService {
  generateAccessToken(payload: any): string;

  generateRefreshToken(payload: any): string;

  verifyToken(token: string): any;
}

export interface JwtSignOptions {
  secret?: string | Buffer;
  privateKey?: string;
  expiresIn?: string | number | undefined;
}
