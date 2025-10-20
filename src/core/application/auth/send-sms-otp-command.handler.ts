import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendSmsOtpCommand } from "./send-sms-otp.command";
import { SendSmsOtpCommandResponse } from "./send-sms-otp-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { ITfaService } from "@/core/domain/auth";
import { IUserRepository, UserNotFoundException } from "@/core/domain/users";

@CommandHandler(SendSmsOtpCommand)
export class SendSmsOtpCommandHandler
  implements ICommandHandler<SendSmsOtpCommand>
{
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly userRepository: IUserRepository,
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
  ) {
    //
  }

  async execute(
    command: SendSmsOtpCommand,
  ): Promise<SendSmsOtpCommandResponse> {
    const user = await this.userRepository.findOneByPhoneNumber(
      command.phoneNumber,
    );
    if (!user) throw new UserNotFoundException();

    await this.tfaService.sendUserSmsOtp(command.phoneNumber);
    return new SendSmsOtpCommandResponse();
  }
}
