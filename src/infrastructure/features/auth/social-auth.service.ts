import { Inject, Injectable } from "@nestjs/common";
import {
  ISocialAuthService,
  SocialUserProfile,
} from "@/core/domain/auth/i-social-auth.service";
import { InvalidSocialTokenException } from "@/core/domain/auth/invalid-social-token.exception";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { ILoggerService } from "@/core/domain/logging";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

interface GoogleTokenInfo {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat: string;
  exp: string;
}

interface AppleJWK {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

interface AppleTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  email_verified?: string;
  nonce?: string;
  nonce_supported?: boolean;
}

@Injectable()
export class SocialAuthService implements ISocialAuthService {
  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.LoggerService)
    private readonly loggerService: ILoggerService,
  ) {}

  async verifyGoogleToken(token: string): Promise<SocialUserProfile> {
    try {
      const googleClientIds = this.configsManagerService
        .getEnvVariable<string>("GOOGLE_CLIENT_IDS")
        .split(",")
        .map((id) => id.trim());

      const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
      const response = await fetch(tokenInfoUrl);

      if (!response.ok) {
        throw new InvalidSocialTokenException();
      }

      const payload: GoogleTokenInfo = await response.json();

      // ✅ Vérifier que le client_id est autorisé
      if (!googleClientIds.includes(payload.aud)) {
        this.loggerService.error("Google token audience mismatch", {
          expected: googleClientIds,
          received: payload.aud,
        });
        throw new InvalidSocialTokenException();
      }

      // ✅ Vérifier l’issuer
      if (
        payload.iss !== "accounts.google.com" &&
        payload.iss !== "https://accounts.google.com"
      ) {
        throw new InvalidSocialTokenException();
      }

      return {
        socialId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatar: payload.picture,
      };
    } catch (error) {
      this.loggerService.error("Google token verification failed", error);
      throw new InvalidSocialTokenException();
    }
  }

  async verifyFacebookToken(token: string): Promise<SocialUserProfile> {
    try {
      const facebookAppId =
        this.configsManagerService.getEnvVariable<string>("FACEBOOK_APP_ID");
      const facebookAppSecret =
        this.configsManagerService.getEnvVariable<string>(
          "FACEBOOK_APP_SECRET",
        );

      // Verify the token with Facebook Graph API
      const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${facebookAppId}|${facebookAppSecret}`;

      const debugResponse = await fetch(debugTokenUrl);
      const debugData = await debugResponse.json();

      if (!debugData.data?.is_valid) {
        throw new InvalidSocialTokenException();
      }

      // Get user profile from Facebook
      const profileUrl = `https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture.type(large)&access_token=${token}`;

      const profileResponse = await fetch(profileUrl);
      const profileData = await profileResponse.json();

      if (profileData.error) {
        throw new InvalidSocialTokenException();
      }

      return {
        socialId: profileData.id,
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        avatar: profileData.picture?.data?.url,
      };
    } catch (error) {
      this.loggerService.error("Facebook token verification failed", error);
      throw new InvalidSocialTokenException();
    }
  }

  async verifyAppleToken(token: string): Promise<SocialUserProfile> {
    try {
      const appleClientIds = this.configsManagerService
        .getEnvVariable<string>("APPLE_CLIENT_IDS")
        .split(",")
        .map((id) => id.trim());

      // Decode JWT header to get the key ID (kid)
      const decodedHeader = jwt.decode(token, { complete: true });
      if (!decodedHeader || !decodedHeader.header?.kid) {
        throw new InvalidSocialTokenException();
      }

      // Fetch Apple's public keys (JWKS)
      const jwksResponse = await fetch("https://appleid.apple.com/auth/keys");
      if (!jwksResponse.ok) {
        throw new InvalidSocialTokenException();
      }

      const jwks: { keys: AppleJWK[] } = await jwksResponse.json();
      const appleKey = jwks.keys.find(
        (key) => key.kid === decodedHeader.header.kid,
      );

      if (!appleKey) {
        this.loggerService.error("Apple public key not found for kid", {
          kid: decodedHeader.header.kid,
        });
        throw new InvalidSocialTokenException();
      }

      // Build RSA public key from JWK components
      const publicKey = crypto.createPublicKey({
        key: {
          kty: appleKey.kty,
          n: appleKey.n,
          e: appleKey.e,
        },
        format: "jwk",
      });

      const pemKey = publicKey.export({ type: "spki", format: "pem" });

      // Verify the JWT signature and claims
      const payload = jwt.verify(token, pemKey, {
        algorithms: ["RS256"],
        issuer: "https://appleid.apple.com",
        audience: appleClientIds,
      }) as AppleTokenPayload;

      return {
        socialId: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      this.loggerService.error("Apple token verification failed", error);
      throw new InvalidSocialTokenException();
    }
  }
}
