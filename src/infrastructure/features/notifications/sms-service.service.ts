import { Inject, Injectable } from "@nestjs/common";
import { ISmsServiceService } from "@/core/domain/notifications";
import { Deps } from "@/core/domain/shared/ioc";
import { ILoggerService } from "@/core/domain/logging";
import axios from "axios";
import { IConfigsManagerService } from "@/core/domain/configs";
import { generateUuid } from "@/lib/ts-utilities/db";
import { AppProfile } from "@/core/domain/shared/enums";


@Injectable()
export class SmsServiceService implements ISmsServiceService {
  constructor(
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
  ) {
    //
  }

  async sendSms(recipients: string[], message: string): Promise<void> {
    const payload = {
      step: null,
      sender: this.configsManagerService.getEnvVariable("SMS_SENDER_NAME"),
      name: `Campagne No${generateUuid()}`,
      campaignType: "SIMPLE",
      recipientSource: "CUSTOM",
      groupId: null,
      filename: null,
      saveAsModel: false,
      destination: "NAT_INTER",
      message,
      emailText: null,
      recipients: this.sanitizeRecipients(recipients),
      sendAt: [],
      dlrUrl: "http://dlr.my.domain.com",
      responseUrl: "http://res.my.domain.com",
    };

    if (this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") == AppProfile.Dev) {
      this.loggerService.info(message, payload);
      return;
    }

    const headers = {
      "Content-Type": "application/features/json",
      Authorization: `Bearer ${process.env.LE_TEXTO_API_KEY}`,
    };


    const campainResponse = await this.createLeTextoCampain(payload, headers);
    await this.scheduleLeTextoCampain(campainResponse.data.id, headers);
  }

  private sanitizeRecipients(recipients: string[]) {
    return recipients.map((recipient) => {
      return {
        phoneNumber: recipient.replace("-", ""),
      };
    });
  }

  private createLeTextoCampain(payload: unknown, headers: any) {
    return axios.post("https://api.letexto.com/v1/campaigns", payload, {
      headers,
    });
  }

  private scheduleLeTextoCampain(campainId: unknown, headers: any) {
    return axios.post(
      `https://api.letexto.com/v1/campaigns/${campainId}/schedules`,
      {},
      { headers: headers },
    );
  }
}
