import axios from "axios";
import { IMailService, INotificationService, ISmsService, SendNotificationParams } from "@/core/domain/notifications";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { Role, UserRole } from "@/core/domain/roles";
import { IUserRepository, UserNotFoundException } from "@/core/domain/users";
import { ILoggerService } from "@/core/domain/logging";


export class NotificationService implements INotificationService {
  constructor(
    @Inject(Deps.ConfigsManagerService) private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUserRepository,
    @Inject(Deps.MailService) private readonly mailService: IMailService,
    @Inject(Deps.SmsService) private readonly smsService: ISmsService,
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
  ) {
  }

  async sendNotification(params: SendNotificationParams) {
    console.log("params : ", params);
    const user = await this.usersRepository.findOne(params.userId);
    if (!user) throw new UserNotFoundException();

    if (params.sendMail) await this.mailService.sendMail({
        to: user.email,
        subject: params.subject,
        text: params.htmlMessage || params.message,
    });

    // if (params.sendSms) await this.smsService.sendSms([user.phoneNumber], params.message);

    try {
      if (!params.skipInAppNotification) await this.sendOneSignalNotification(params, (user.role as Role)?.id as UserRole);
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  private async sendOneSignalNotification(params: SendNotificationParams, userRole?: UserRole) {
    const credentials = await this.getOneSignalCredentials(userRole);
    const data = {
      app_id: credentials.app_id,
      headings: { en: params.subject },
      contents: { en: params.message },
      include_external_user_ids: [params.userId],
    };

    const config = {
      headers: {
        "Authorization": `Basic ${credentials.api_key}`,
        "Content-Type": "application/json",
      },
    };

    await axios.post("https://onesignal.com/api/v1/notifications", data, config);
  }

  private async getOneSignalCredentials(userRole: UserRole) {
    const keyPrefix = userRole == UserRole.Customer ? "CLIENT" : "PRO";
    return {
      app_id: this.configsManagerService.getEnvVariable(`ONE_SIGNAL_${keyPrefix}_APP_ID`),
      api_key: this.configsManagerService.getEnvVariable(`ONE_SIGNAL_${keyPrefix}_API_KEY`),
    };
  }
}
