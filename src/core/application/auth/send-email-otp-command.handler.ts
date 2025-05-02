import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendEmailOtpCommand } from "./send-email-otp.command";
import { SendEmailOtpCommandResponse } from "./send-email-otp-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { ITfaService } from "@/core/domain/auth";
import { IMailService, ISmsService, SendMailParams } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { SendSmsOtpCommandResponse } from "@/core/application/auth/send-sms-otp-command.response";

@CommandHandler(SendEmailOtpCommand)
export class SendEmailOtpCommandHandler implements ICommandHandler<SendEmailOtpCommand> {
  constructor(
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
    @Inject(Deps.MailService) private readonly mailService: IMailService,
    @Inject(Deps.GlobalizationService) private readonly globalizationService: IGlobalizationService,
  ) {
    //
  }

  async execute(command: SendEmailOtpCommand): Promise<SendEmailOtpCommandResponse> {
    const otp = await this.tfaService.generateUserEmailOtp(command.email);

    const emailParams = new SendMailParams({
      to: command.email,
      subject: this.globalizationService.t("all.mail.otp_sent_subject", { args: { otp } }),
      html: this.globalizationService.t("all.mail.otp_sent_body", { args: { otp } }),
    });

    await this.mailService.sendMail(emailParams);
    return new SendSmsOtpCommandResponse();
  }
}
