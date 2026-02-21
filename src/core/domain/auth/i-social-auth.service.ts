export interface SocialUserProfile {
  socialId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface ISocialAuthService {
  verifyGoogleToken(token: string): Promise<SocialUserProfile>;
  verifyFacebookToken(token: string): Promise<SocialUserProfile>;
  verifyAppleToken(token: string): Promise<SocialUserProfile>;
}
