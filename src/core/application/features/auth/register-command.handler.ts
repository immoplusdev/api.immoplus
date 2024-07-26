import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCommand } from "@/core/application/features/auth/register.command";
import { RegisterCommandResponse } from "@/core/application/features/auth/register-command.response";
import { Inject } from "@nestjs/common";
import { IUsersRepository } from "@/core/domain/users";
import { UserEmailAlreadyTakenException } from "@/core/application/features/auth/user-email-already-taken.exception";
import {
  UserPhoneNumberAlreadyTakenException,
} from "@/core/application/features/auth/user-phone-number-already-taken.exception";
import { Deps } from "@/core/domain/shared/ioc";
import { IPasswordManagerService } from "@/core/domain/auth";
import { UserRole } from "@/core/domain/roles";

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand, RegisterCommandResponse> {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
  ) {
  }

  async execute(command: RegisterCommand): Promise<RegisterCommandResponse> {
    await this.validateInput(command);

    const user = await this.usersRepository.create({
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: this.passwordManagerService.encryptPassword(command.password),
      firstName: command.firstName,
      lastName: command.lastName,
      role: UserRole.Customer,
      city: command.city || null,
    });

    return new RegisterCommandResponse({
      user,
    });
  }

  async validateInput(command: RegisterCommand) {
    await this.verifyEmailAvailable(command.email);
    await this.verifyPhoneNumberAvailable(command.phoneNumber);
  }

  async verifyEmailAvailable(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (user?.id) throw new UserEmailAlreadyTakenException();
  }

  async verifyPhoneNumberAvailable(phoneNumber: string) {
    const user = await this.usersRepository.findByPhoneNumber(phoneNumber);
    if (user?.id) throw new UserPhoneNumberAlreadyTakenException();
  }
}
