import { Inject, Injectable } from "@nestjs/common";
import { ISmsService } from "@/core/domain/notifications";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";

const twilio = require("twilio");
import { sanitizePhoneNumber } from "@/lib/ts-utilities/strings";


@Injectable()
export class SmsService implements ISmsService {
  constructor(
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
  ) {
  
  }

  async sendSms(recipients: string[], message: string): Promise<void> {
    const client = twilio(
      this.configsManagerService.getEnvVariable("TWILIO_ACCOUNT_SID"),
      this.configsManagerService.getEnvVariable("TWILIO_AUTH_TOKEN"),
    );

    await client.messages.create({
      body: message,
      messagingServiceSid: this.configsManagerService.getEnvVariable("TWILIO_MESSAGING_SERVICE_ID"),
      to: this.sanitizeRecipients(recipients)[0],
    });
  }

  private sanitizeRecipients(recipients: string[]): string[] {
    return recipients.map(recipient => sanitizePhoneNumber(recipient));
  }


}
