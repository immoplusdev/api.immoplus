import {
  IMailService,
  INotificationService,
  ISmsService,
  SendNotificationParams,
} from "@/core/domain/notifications";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import axios from "axios";
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

    const user = await this.usersRepository.findOne(params.userId);
    if (!user) throw new UserNotFoundException();

    if (params.sendMail) await this.mailService.sendMail({
      to: user.email,
      subject: params.subject,
      text: params.htmlMessage || params.message,
    });

    if (params.sendSms) await this.smsService.sendSms([user.phoneNumber], params.message);

    try {
      if (!params.skipInAppNotification) await this.sendOneSignalNotification(params, (user.role as Role)?.id as UserRole);
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  private async sendOneSignalNotification(params: SendNotificationParams, userRole?: UserRole) {
    const credentials = await this.getOneSignalCredentials(userRole);
    let returnUrl = this.configsManagerService.getEnvVariable("ONE_SIGNAL_RETURN_URL");
    if (params.returnUrl) returnUrl += `/${params.returnUrl}`;

    const data = {
      app_id: credentials.app_id,
      include_external_user_ids: [params.userId],
      headings: { en: params.subject },
      contents: { en: params.message },
      url: returnUrl,
    };


    const config = {
      headers: {
        "Authorization": `Basic ${credentials.api_key}`,
        "Content-Type": "application/json",
        // "Cookie": "__cf_bm=lam2Uza6BI0UtCAcHcwcSAjbL1FBh7dQfWFFs90PXDY-1732373822-1.0.1.1-q3GkVVp99tCpKqKZpX0cXQirBkJauZmgiiJY3WZxNLGdZz1YjpfnII7DwEZ9Qyrwy.8QRYTT1e_Eb_Z75ELW2A",
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
