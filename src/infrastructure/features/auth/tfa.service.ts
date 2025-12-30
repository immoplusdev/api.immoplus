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

  // async sendUserSmsOtp(phoneNumber: string) {
  //   try {
  //     const user = await this.usersRepository.findOneByPhoneNumber(
  //       phoneNumber,
  //       {
  //         fields: ["id", "phoneNumber"],
  //       },
  //     );
  //     this.loggerService.info(`Sending SMS OTP to user: ${user?.id}`);
  //     if (!user) throw new UserNotFoundException();

  //     const to = sanitizePhoneNumberIntl(phoneNumber);
  //     const otp =
  //       phoneNumber === "2250700000001" ? "675494" : this.generateOtp();
  //     await this.usersRepository.updateOne(user.id, { otp });

  //     if (phoneNumber !== "2250700000001") {
  //       await this.twilioService.messages.create({
  //         body: `Votre code de vérification est : ${otp}`,
  //         messagingServiceSid: this.configsManagerService.getEnvVariable(
  //           "TWILIO_MESSAGING_SERVICE_ID",
  //         ),
  //         to: to,
  //       });
  //     }
  //   } catch (e) {
  //     this.loggerService.error(`Error sending SMS OTP: ${e.message}`, e);
  //     throw new NotificationException(
  //       e.message,
  //       e.status,
  //       e.messageCode,
  //       e.messageId,
  //     );
  //   }
  // }

  async sendUserSmsOtp(phoneNumber: string) {
    try {
      const user = await this.usersRepository.findOneByPhoneNumber(
        phoneNumber,
        { fields: ["id", "phoneNumber"] },
      );

      if (!user) throw new UserNotFoundException();

      this.loggerService.info(`Sending SMS OTP to user: ${user.id}`);

      const to = phoneNumber;
      const otp =
        phoneNumber === "2250700000001" ? "675494" : this.generateOtp();

      await this.usersRepository.updateOne(user.id, { otp });

      if (phoneNumber !== "2250700000001") {
        const smsProvider =
          this.configsManagerService.getEnvVariable<string>("SMS_PROVIDER") ??
          "letexto";

        const message = `Votre code de vérification est : ${otp}`;

        if (smsProvider === "twilio") {
          await this.sendSmsViaTwilio(to, message);
        } else if (smsProvider === "letexto") {
          await this.sendSmsViaLetexto(to, message);
        }
      }
    } catch (e) {
      this.loggerService.error(`❌ Error sending SMS OTP: ${e.message}`);

      if (e.status) {
        this.loggerService.error(`Error Code: ${e.code}`);
        this.loggerService.error(`Status: ${e.status}`);
        this.loggerService.error(`More info: ${e.moreInfo || "N/A"}`);
      }

      this.loggerService.error(e.stack);

      throw new NotificationException(
        e.message,
        e.status,
        e.messageCode,
        e.messageId,
      );
    }
  }

  private async sendSmsViaTwilio(
    to: string,
    sendmessage: string,
  ): Promise<void> {
    const from: string = this.configsManagerService.getEnvVariable(
      "TWILIO_PHONE_NUMBER",
    );

    const receptor = sanitizePhoneNumberIntl(to);

    this.loggerService.info(`Sending SMS to: ${receptor}`);
    this.loggerService.info(`Sending SMS from: ${from}`);

    const message = await this.twilioService.messages.create({
      body: sendmessage,
      from: from,
      to: receptor,
    });

    this.loggerService.info(`✅ SMS sent successfully. SID: ${message.sid}`);
  }

  private async sendSmsViaLetexto(
    to: string,
    sendmessage: string,
  ): Promise<void> {
    const apiKey =
      this.configsManagerService.getEnvVariable<string>("LETEXTO_API_KEY") ??
      "eaae56e05bf95ec6854e41821383fee5";
    const sender =
      this.configsManagerService.getEnvVariable<string>("LETEXTO_SENDER") ??
      "Immoplus";
    const apiUrl =
      this.configsManagerService.getEnvVariable<string>("LETEXTO_API_URL") ??
      "https://apis.letexto.com/v1/messages/send";

    const completeUrl =
      apiUrl +
      "?token=" +
      apiKey +
      "&from=" +
      sender +
      "&to=" +
      to +
      "&content=" +
      sendmessage;

    const response = await fetch(completeUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: null,
    });

    if (!response.ok) {
      throw new Error(`Letexto API error: ${response.statusText}`);
    }

    this.loggerService.info(`✅ SMS sent successfully via Letexto`);
  }

  async isUserSmsOtpValid(phoneNumber: string, otp: string) {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber, {
      fields: ["phoneNumber"],
    });
    console.log("isUserSmsOtpValid User: ", user);

    if (!user) throw new UserNotFoundException();

    try {
      const otpIsValid = user.otp === otp;
      console.log("isUserSmsOtpValid: ", otpIsValid);

      if (!otpIsValid) throw new InvalidOtpException();

      return otpIsValid;
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
