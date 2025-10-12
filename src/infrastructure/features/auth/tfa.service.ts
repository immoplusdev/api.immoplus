import { Inject, Injectable } from "@nestjs/common";
import {
  InvalidOtpException,
  ITfaService,
  VerifyOtpOptions,
} from "@/core/domain/auth";
import { Deps } from "@/core/domain/common/ioc";
import { IUserRepository, UserNotFoundException } from "@/core/domain/users";
import {
  generateRandomString,
  sanitizePhoneNumberIntl,
} from "@/lib/ts-utilities/strings";
import { Twilio } from "twilio";
import { IConfigsManagerService } from "@/core/domain/configs";
import { ILoggerService } from "@/core/domain/logging";
import { AppProfile } from "@/core/domain/common/enums";
import {
  BYPASS_USER_EMAIL,
  BYPASS_USER_PHONE_NUMBER,
} from "@/infrastructure/configs";
import { NotificationException } from "@/core/domain/auth/notification.exception";

const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

@Injectable()
export class TfaService implements ITfaService {
  private readonly twilioService: Twilio;
  private readonly verifyServiceSid: string;

  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.LoggerService)
    private readonly loggerService: ILoggerService,
  ) {
    this.twilioService = twilio(
      this.configsManagerService.getEnvVariable("TWILIO_ACCOUNT_SID"),
      this.configsManagerService.getEnvVariable("TWILIO_AUTH_TOKEN"),
    );
    this.verifyServiceSid = this.configsManagerService.getEnvVariable(
      "TWILIO_VERIFY_SERVICE_ID",
    );
  }

  generateOtp(): string {
    return generateRandomString(6, "number");
  }

  async generateUserOtp(userId: string) {
    try {
      const otp = this.generateOtp();
      await this.usersRepository.updateOne(userId, {
        otp,
        authLoginAttempts: 0,
      });
      return otp;
    } catch (err) {
      throw new UserNotFoundException();
    }
  }

  async generateUserPhoneNumberOtp(phoneNumber: string) {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber, {
      fields: ["id"],
    });
    if (!user) throw new UserNotFoundException();

    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async generateUserEmailOtp(email: string) {
    const user = await this.usersRepository.findOneByEmail(email, {
      fields: ["id"],
    });
    if (!user) throw new UserNotFoundException();

    const otp = this.generateOtp();
    await this.usersRepository.updateOne(user.id, { otp });
    return otp;
  }

  async sendUserSmsOtp(phoneNumber: string) {
    try {
      const user = await this.usersRepository.findOneByPhoneNumber(
        phoneNumber,
        {
          fields: ["phoneNumber"],
        },
      );
      console.log("user : ", user);
      if (!user) throw new UserNotFoundException();

      const to = sanitizePhoneNumberIntl(phoneNumber);
      const otp = this.generateOtp();
      await this.usersRepository.updateOne(user.id, { otp });

      await this.twilioService.messages.create({
        body: `Votre code de vérification est : ${otp}`,
        from: this.configsManagerService.getEnvVariable("TWILIO_PHONE_NUMBER"),
        to: to,
      });
    } catch (e) {
      this.loggerService.error(e);
      throw new NotificationException(
        e.message,
        e.status,
        e.messageCode,
        e.messageId,
      );
    }
  }

  async isUserSmsOtpValid(phoneNumber: string, otp: string) {
    if (
      this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") ==
        AppProfile.Dev ||
      phoneNumber == BYPASS_USER_PHONE_NUMBER
    )
      return true;

    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber, {
      fields: ["phoneNumber"],
    });
    if (!user) throw new UserNotFoundException();

    try {
      const to = sanitizePhoneNumberIntl(user.phoneNumber);

      const verificationCheck = await this.twilioService.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ code: otp, to });

      return verificationCheck.status == "approved";
    } catch (e) {
      this.loggerService.error(e);
      return false;
    }
  }

  async verifyUserOtp(userId: string, otp: string, options?: VerifyOtpOptions) {
    const user = await this.usersRepository.findOne(userId, {
      fields: ["id", "otp"],
    });
    if (!user) throw new UserNotFoundException();

    if (
      this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") ==
        AppProfile.Dev ||
      user.phoneNumber == BYPASS_USER_PHONE_NUMBER ||
      user.email == BYPASS_USER_EMAIL
    )
      return true;

    const otpIsValid = user.otp === otp;

    if (!otpIsValid && options?.throwException) throw new InvalidOtpException();

    if (otpIsValid && options?.resetIfValid) await this.generateUserOtp(userId);

    return otpIsValid;
  }

  async verifyUserEmailOtp(
    email: string,
    otp: string,
    options?: VerifyOtpOptions,
  ) {
    if (
      this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") ==
        AppProfile.Dev ||
      email == BYPASS_USER_EMAIL
    )
      return true;

    const user = await this.usersRepository.findOneByEmail(email, {
      fields: ["id", "otp"],
    });
    if (!user) throw new UserNotFoundException();

    const otpIsValid = user.otp === otp;

    if (!otpIsValid && options?.throwException) throw new InvalidOtpException();

    if (otpIsValid && options?.resetIfValid)
      await this.generateUserOtp(user.id);

    return otpIsValid;
  }

  async verifyUserPhoneNumberOtp(
    phoneNumber: string,
    otp: string,
    options?: VerifyOtpOptions,
  ) {
    if (
      this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") ==
        AppProfile.Dev ||
      phoneNumber == BYPASS_USER_PHONE_NUMBER
    )
      return true;

    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber, {
      fields: ["id", "otp"],
    });
    if (!user) throw new UserNotFoundException();

    const otpIsValid = user.otp === otp;

    if (!otpIsValid && options?.throwException) throw new InvalidOtpException();

    if (otpIsValid && options?.resetIfValid)
      await this.generateUserOtp(user.id);

    return otpIsValid;
  }
}
