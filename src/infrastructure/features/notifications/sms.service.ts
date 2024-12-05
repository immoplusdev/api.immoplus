import { Inject, Injectable } from "@nestjs/common";
import { ISmsService } from "@/core/domain/notifications";
import { Deps } from "@/core/domain/shared/ioc";
// import { ILoggerService } from "@/core/domain/logging";
// import axios from "axios";
import { IConfigsManagerService } from "@/core/domain/configs";

const twilio = require("twilio");
// import { AppProfile } from "@/core/domain/shared/enums";
import { sanitizePhoneNumber } from "@/lib/ts-utilities/strings";


@Injectable()
export class SmsService implements ISmsService {
  constructor(
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
    // @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
  ) {
    //
  }

  async sendSms(recipients: string[], message: string): Promise<void> {
    const client = twilio(
      this.configsManagerService.getEnvVariable("TWILIO_ACCOUNT_SID"),
      this.configsManagerService.getEnvVariable("TWILIO_AUTH_TOKEN"),
    );

    // if (this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") == AppProfile.Dev) return this.loggerService.info(message);

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
