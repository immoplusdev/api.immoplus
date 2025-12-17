import { Inject, Injectable } from "@nestjs/common";
import { IMailService, SendMailParams } from "@/core/domain/notifications";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { ILoggerService } from "@/core/domain/logging";
import { AppProfile } from "@/core/domain/common/enums";

const nodemailer = require("nodemailer");

@Injectable()
export class MailService implements IMailService {
  private readonly mailTransport: any;
  private readonly mailingConfig: Record<string, any>;

  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
  ) {
    this.mailingConfig = {
      host: this.configsManagerService.getEnvVariable("NODE_MAILER_HOST"),
      port: parseInt(
        this.configsManagerService.getEnvVariable("NODE_MAILER_PORT"),
      ),
      // secure: this.configsManagerService.getEnvVariable("NODE_MAILER_SECURE") == "true",
      auth: {
        user: this.configsManagerService.getEnvVariable("NODE_MAILER_USER"),
        pass: this.configsManagerService.getEnvVariable("NODE_MAILER_PASSWORD"),
      },
      // tls: {
      //   rejectUnauthorized: this.configsManagerService.getEnvVariable("NODE_MAILER_IGNORE_TLS") == "true",
      // },
    };
    this.mailTransport = nodemailer.createTransport(this.mailingConfig);
  }

  async sendMail(params: SendMailParams) {
    const mailParams = {
      ...params,
      from: params.from ? params.from : process.env.NODE_MAILER_FROM,
    };

    // if (
    //   this.configsManagerService.getEnvVariable("NEST_APP_PROFILE") ==
    //   AppProfile.Dev
    // ) {
    //   // this.loggerService.info(params.html || params.text, params);
    //   // return;
    //   mailParams.to = "dev.johnlight@gmail.com";
    // }

    this.mailTransport.sendMail(mailParams);
  }

  async isMailServerAlive(): Promise<boolean> {
    const loggerService = this.loggerService;
    return new Promise((resolve, reject) => {
      this.mailTransport.verify(function (error: unknown, _success: unknown) {
        if (error) {
          loggerService.error(error.toString(), error);
          reject(false);
        } else {
          loggerService.info("mail server alive");
          resolve(true);
        }
      });
    });
  }
}
