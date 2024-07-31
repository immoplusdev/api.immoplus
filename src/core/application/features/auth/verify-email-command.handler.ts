import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyEmailCommand } from "./verify-email.command";
import { VerifyEmailCommandResponse } from "./verify-email-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { ITfaService } from "@/core/domain/auth";
import { IGlobalizationService } from "@/core/domain/globalization";
import { IUsersRepository } from "@/core/domain/users";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUsersRepository,
  ) {
    //
  }

  async execute(command: VerifyEmailCommand): Promise<VerifyEmailCommandResponse> {
    await this.tfaService.verifyUserEmailOtp(command.email, command.otp, { throwException: true });
    const user = await this.usersRepository.findOneByEmail(command.email, ["id"]);
    await this.usersRepository.updateOne(user.id, { emailVerified: true });
    return new VerifyEmailCommandResponse();
  }
}
