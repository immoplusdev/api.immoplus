export class RefreshTokenCommandResponse {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: string,
  ) {}
}
