import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendEmailOtpCommand } from "./send-email-otp.command";
import { SendEmailOtpCommandResponse } from "./send-email-otp-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { ITfaService } from "@/core/domain/auth";
import {
  IMailService,
  SendMailParams,
  IEmailTemplateService,
  EmailTemplate,
} from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { SendSmsOtpCommandResponse } from "@/core/application/auth/send-sms-otp-command.response";
import { IUserRepository, UserNotFoundException } from "@/core/domain/users";

@CommandHandler(SendEmailOtpCommand)
export class SendEmailOtpCommandHandler implements ICommandHandler<SendEmailOtpCommand> {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly userRepository: IUserRepository,
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
    @Inject(Deps.MailService) private readonly mailService: IMailService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
    @Inject(Deps.EmailTemplateService)
    private readonly emailTemplateService: IEmailTemplateService,
  ) {
    //
  }

  async execute(
    command: SendEmailOtpCommand,
  ): Promise<SendEmailOtpCommandResponse> {
    const user = await this.userRepository.findOneByEmail(command.email);
    if (!user) throw new UserNotFoundException();

    const otp = await this.tfaService.generateUserEmailOtp(command.email);
    const otpDigits = otp.split("");

    const html = await this.emailTemplateService.render(EmailTemplate.OTP, {
      prenom: user.firstName || "Utilisateur",
      otpDigit1: otpDigits[0] || "",
      otpDigit2: otpDigits[1] || "",
      otpDigit3: otpDigits[2] || "",
      otpDigit4: otpDigits[3] || "",
      otpDigit5: otpDigits[4] || "",
      otpDigit6: otpDigits[5] || "",
      lien: "https://immoplus.ci",
      unsubscribe_link: "https://immoplus.ci/unsubscribe",
    });

    const emailParams = new SendMailParams({
      to: command.email,
      subject: this.globalizationService.t("all.mail.otp_sent_subject", {
        args: { otp },
      }),
      html,
    });

    await this.mailService.sendMail(emailParams);
    return new SendSmsOtpCommandResponse();
  }
}
