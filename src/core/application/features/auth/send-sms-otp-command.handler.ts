import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendSmsOtpCommand } from "./send-sms-otp.command";
import { SendSmsOtpCommandResponse } from "./send-sms-otp-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { ITfaService } from "@/core/domain/auth";
import { ISmsService } from "@/core/domain/notifications";
import { I18nService } from "nestjs-i18n";
import { IGlobalizationService } from "@/core/domain/globalization";

@CommandHandler(SendSmsOtpCommand)
export class SendSmsOtpCommandHandler implements ICommandHandler<SendSmsOtpCommand> {
  constructor(
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
    @Inject(Deps.SmsService) private readonly smsService: ISmsService,
    @Inject(Deps.GlobalizationService) private  readonly  globalizationService: IGlobalizationService
  ) {
    //
  }

  async execute(command: SendSmsOtpCommand): Promise<SendSmsOtpCommandResponse> {
    const otp = await this.tfaService.generateUserPhoneNumberOtp(command.phoneNumber);
    const message = this.globalizationService.t("all.sms.otp_sent", { args: { otp } });
    await this.smsService.sendSms([command.phoneNumber], message);
    return new SendSmsOtpCommandResponse();
  }
}
