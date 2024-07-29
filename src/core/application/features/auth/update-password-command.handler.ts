import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePasswordCommand } from "./update-password.command";
import { UpdatePasswordCommandResponse } from "./update-password-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IUsersRepository } from "@/core/domain/users";
import { IPasswordManagerService } from "@/core/domain/auth";
import { InvalidCredentialsException } from "@/core/domain/shared/exceptions";
import { WrongPasswordException } from "@/core/domain/auth/wrong-password.exception";

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
  ) {
    //
  }

  async execute(command: UpdatePasswordCommand): Promise<UpdatePasswordCommandResponse> {
    const user = await this.usersRepository.findOne(command.userId);

    this.verifyPassword(command.oldPassword, user.password);

    await this.updatePassword(command.userId, command.newPassword);

    return new UpdatePasswordCommandResponse();
  }

  private async updatePassword(userId: string, password: string) {
    await this.usersRepository.update(userId, { password: this.passwordManagerService.encryptPassword(password) });
  }

  private verifyPassword(password: string, hash: string) {
    if (!this.passwordManagerService.passwordMatchesHash(password, hash)) throw new WrongPasswordException();
  }
}
