import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyEmailCommand } from "./verify-email.command";
import { VerifyEmailCommandResponse } from "./verify-email-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { ITfaService } from "@/core/domain/auth";
import { IUsersRepository } from "@/core/domain/users";
import { UnexpectedException } from "@/core/domain/shared/exceptions";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUsersRepository,
  ) {
    //
  }

  async execute(command: VerifyEmailCommand): Promise<VerifyEmailCommandResponse> {
    await this.tfaService.verifyUserEmailOtp(command.email, command.otp, { throwException: true, resetIfValid: true });

    const user = await this.usersRepository.findOneByEmail(command.email, { fields: ["id", "emailVerified"] });
    if (user.emailVerified) throw new UnexpectedException();

    await this.usersRepository.updateOne(user.id, { emailVerified: true });
    return new VerifyEmailCommandResponse();
  }
}
