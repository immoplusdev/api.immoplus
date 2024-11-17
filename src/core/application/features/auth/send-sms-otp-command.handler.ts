import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendSmsOtpCommand } from "./send-sms-otp.command";
import { SendSmsOtpCommandResponse } from "./send-sms-otp-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { ITfaService } from "@/core/domain/auth";
import { ISmsService } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";

@CommandHandler(SendSmsOtpCommand)
export class SendSmsOtpCommandHandler implements ICommandHandler<SendSmsOtpCommand> {
  constructor(
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
  ) {
    //
  }

  async execute(command: SendSmsOtpCommand): Promise<SendSmsOtpCommandResponse> {
    await this.tfaService.sendUserSmsOtp(command.phoneNumber);
    return new SendSmsOtpCommandResponse();
  }
}
