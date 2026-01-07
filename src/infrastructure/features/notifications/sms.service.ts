import { Inject, Injectable } from "@nestjs/common";
import { ISmsService } from "@/core/domain/notifications";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";

const twilio = require("twilio");
import { sanitizePhoneNumber } from "@/lib/ts-utilities/strings";

@Injectable()
export class SmsService implements ISmsService {
  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {}

  async sendSms(recipients: string[], message: string): Promise<void> {
    const smsProvider =
      this.configsManagerService.getEnvVariable<string>("SMS_PROVIDER");
    console.log("smsProvider", smsProvider);
    if (smsProvider === "twilio") {
      await this.sendViaTwilio(recipients, message);
    }

    if (smsProvider === "letexto") {
      await this.sendViaLetexto(recipients, message);
    }
  }

  private async sendViaTwilio(
    recipients: string[],
    message: string,
  ): Promise<void> {
    const accountSid =
      this.configsManagerService.getEnvVariable<string>("TWILIO_ACCOUNT_SID");
    const authToken =
      this.configsManagerService.getEnvVariable<string>("TWILIO_AUTH_TOKEN");
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: message,
      from: this.configsManagerService.getEnvVariable("TWILIO_PHONE_NUMBER"),
      to: this.sanitizeRecipients(recipients)[0],
    });
  }

  private async sendViaLetexto(
    recipients: string[],
    message: string,
  ): Promise<void> {
    const apiKey =
      this.configsManagerService.getEnvVariable<string>("LETEXTO_API_KEY");
    const sender =
      this.configsManagerService.getEnvVariable<string>("LETEXTO_SENDER");
    const apiUrl =
      this.configsManagerService.getEnvVariable<string>("LETEXTO_API_URL");

    const to = recipients[0];

    const completeUrl =
      apiUrl +
      "?token=" +
      apiKey +
      "&from=" +
      sender +
      "&to=" +
      to +
      "&content=" +
      message;

    console.log("completeUrl", completeUrl);

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
  }

  private sanitizeRecipients(recipients: string[]): string[] {
    return recipients.map((recipient) => sanitizePhoneNumber(recipient));
  }
}
