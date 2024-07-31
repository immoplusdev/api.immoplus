import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResetPasswordCommand } from "./reset-password.command";
import { ResetPasswordCommandResponse } from "./reset-password-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IPasswordManagerService, ITfaService } from "@/core/domain/auth";
import { IUsersRepository } from "@/core/domain/users";

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    @Inject(Deps.TfaService) private readonly tfaService: ITfaService,
    @Inject(Deps.UsersRepository) private readonly usersRepository: IUsersRepository,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
  ) {
    //
  }

  async execute(command: ResetPasswordCommand): Promise<ResetPasswordCommandResponse> {
    await this.verifyOtp(command);

    const user = await this.usersRepository.findOneByUsername(command.username, ["id"]);

    await this.usersRepository.updateOne(user.id, { password: this.passwordManagerService.encryptPassword(command.newPassword) });
    
    return new ResetPasswordCommandResponse();
  }

  private async verifyOtp(command: ResetPasswordCommand) {
    if (command.username.includes("@")) {
      await this.tfaService.verifyUserEmailOtp(command.username, command.otp, {
        throwException: true,
        resetIfValid: true,
      });
    } else {
      await this.tfaService.verifyUserPhoneNumberOtp(command.username, command.otp, {
        throwException: true,
        resetIfValid: true,
      });
    }
  }
}
