import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SocialLoginCommand, SocialAuthProvider } from "./social-login.command";
import { SocialLoginCommandResponse } from "./social-login-command.response";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "@/core/domain/logging";
import { Deps } from "@/core/domain/common/ioc";
import { IUserRepository, User, UserStatus } from "@/core/domain/users";
import {
  IAuthService,
  InvalidCredentialsException,
  UserCannotLoginException,
} from "@/core/domain/auth";
import {
  ISocialAuthService,
  SocialUserProfile,
} from "@/core/domain/auth/i-social-auth.service";
import { InvalidSocialTokenException } from "@/core/domain/auth/invalid-social-token.exception";
import { verifyUserType } from "../common/verify-user-type";
import { UserApp, UserRole } from "@/core/domain/roles";

@CommandHandler(SocialLoginCommand)
export class SocialLoginCommandHandler implements ICommandHandler<SocialLoginCommand> {
  constructor(
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
    @Inject(Deps.UsersRepository)
    private readonly userRepository: IUserRepository,
    @Inject(Deps.AuthService) private readonly authService: IAuthService,
    @Inject(Deps.SocialAuthService)
    private readonly socialAuthService: ISocialAuthService,
  ) {
    //
  }

  async execute(
    command: SocialLoginCommand,
  ): Promise<SocialLoginCommandResponse> {
    // Verify the social token and get user profile
    const socialProfile = await this.verifySocialToken(
      command.provider,
      command.token,
    );

    // Try to find existing user by social ID or email
    let user = await this.findUserBySocialIdOrEmail(
      command.provider,
      socialProfile,
    );

    if (user) {
      // User exists - verify they can login
      this.verifyUserCanLogin(user);
      verifyUserType(user, command.source);

      // Link social account if not already linked
      user = await this.linkSocialAccountIfNeeded(
        user,
        command.provider,
        socialProfile.socialId,
      );
      await this.createUserSession(user);
      return this.generateUserTokens(user);
    } else {
      // Create new user from social profile
      // user = await this.createUserFromSocialProfile(
      //   command.provider,
      //   socialProfile,
      //   command.source,
      // );
      throw new InvalidCredentialsException({
        message: "$t:all.exception.social_account_not_found",
        statusCode: 404,
        error: "SocialAccountNotFound",
        code: "SOCIAL_ACCOUNT_NOT_FOUND",
      });
    }
  }

  private async verifySocialToken(
    provider: SocialAuthProvider,
    token: string,
  ): Promise<SocialUserProfile> {
    try {
      switch (provider) {
        case SocialAuthProvider.Google:
          return await this.socialAuthService.verifyGoogleToken(token);
        case SocialAuthProvider.Facebook:
          return await this.socialAuthService.verifyFacebookToken(token);
        default:
          throw new InvalidSocialTokenException();
      }
    } catch (error) {
      this.loggerService.error("Social token verification failed", error);
      throw new InvalidSocialTokenException();
    }
  }

  private async findUserBySocialIdOrEmail(
    provider: SocialAuthProvider,
    profile: SocialUserProfile,
  ): Promise<User | null> {
    // First, try to find by social ID
    let user: User | null = null;

    if (provider === SocialAuthProvider.Google && profile.socialId) {
      user = await this.userRepository.findOneByGoogleId(profile.socialId);
    } else if (provider === SocialAuthProvider.Facebook && profile.socialId) {
      user = await this.userRepository.findOneByFacebookId(profile.socialId);
    }

    // If not found by social ID, try to find by email
    if (!user && profile.email) {
      user = await this.userRepository.findOneByEmail(profile.email);
    }

    return user;
  }

  private verifyUserCanLogin(user: User) {
    if (user.status !== UserStatus.Active) {
      throw new UserCannotLoginException();
    }
  }

  private async linkSocialAccountIfNeeded(
    user: User,
    provider: SocialAuthProvider,
    socialId: string,
  ): Promise<User> {
    const updates: Partial<User> = {};

    if (provider === SocialAuthProvider.Google && !user.googleId) {
      updates.googleId = socialId;
    } else if (provider === SocialAuthProvider.Facebook && !user.facebookId) {
      updates.facebookId = socialId;
    }

    if (Object.keys(updates).length > 0) {
      await this.userRepository.updateOne(user.id, updates);
      return new User({ ...user, ...updates });
    }

    return user;
  }

  private async createUserFromSocialProfile(
    provider: SocialAuthProvider,
    profile: SocialUserProfile,
    source: UserApp,
  ): Promise<User> {
    let role: UserRole;

    if (source === UserApp.ProApp) {
      role = UserRole.ProEntreprise;
    } else {
      role = UserRole.Customer;
    }

    const newUser: Partial<User> = {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
      emailVerified: !!profile.email,
      status: UserStatus.Active,
      role: role,
      authLoginAttempts: 0,
      identityVerified: false,
      phoneNumberVerified: false,
      compteProValide: false,
    };

    if (provider === SocialAuthProvider.Google) {
      newUser.googleId = profile.socialId;
    } else if (provider === SocialAuthProvider.Facebook) {
      newUser.facebookId = profile.socialId;
    }

    return await this.userRepository.createOne(newUser);
  }

  private generateUserTokens(user: User): SocialLoginCommandResponse {
    return this.authService.generateUserTokens(user);
  }

  private async createUserSession(user: User) {
    await this.authService.createUserSession(user);
  }
}
