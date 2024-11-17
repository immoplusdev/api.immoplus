import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCommand } from "@/core/application/features/auth/register.command";
import { RegisterCommandResponse } from "@/core/application/features/auth/register-command.response";
import { Inject } from "@nestjs/common";
import { IUserDataRepository, IUserRepository } from "@/core/domain/users";
import { UserEmailAlreadyTakenException } from "@/core/application/features/auth/user-email-already-taken.exception";
import {
  UserPhoneNumberAlreadyTakenException,
} from "@/core/application/features/auth/user-phone-number-already-taken.exception";
import { Deps } from "@/core/domain/shared/ioc";
import { IPasswordManagerService } from "@/core/domain/auth";
import { UserRole } from "@/core/domain/roles";
import { generateUuid } from "@/lib/ts-utilities/db";
import { IConfigsManagerService } from "@/core/domain/configs";


@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand, RegisterCommandResponse> {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
    @Inject(Deps.UsersDataRepository)
    private readonly usersDataRepository: IUserDataRepository,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {
  }

  async execute(command: RegisterCommand): Promise<RegisterCommandResponse> {
    await this.validateInput(command);

    const userId = generateUuid();
    const userData = await this.usersDataRepository.createOne({
      activite: null,
      user: userId,
    });

    const user = await this.usersRepository.createOne({
      id: userId,
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: this.passwordManagerService.encryptPassword(command.password),
      firstName: command.firstName,
      lastName: command.lastName,
      role: UserRole.Customer,
      additionalData: userData.id,
      createdBy: this.configsManagerService.getEnvVariable("NEST_APP_ADMIN_PASSWORD_ID"),
      avatar: command.avatar || null,
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
    const user = await this.usersRepository.findOneByEmail(email);
    if (user?.id) throw new UserEmailAlreadyTakenException();
  }

  async verifyPhoneNumberAvailable(phoneNumber: string) {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber);
    if (user?.id) throw new UserPhoneNumberAlreadyTakenException();
  }
}
