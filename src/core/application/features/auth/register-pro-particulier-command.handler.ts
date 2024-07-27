import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterProParticulierCommand } from "./register-pro-particulier.command";
import { RegisterProParticulierCommandResponse } from "./register-pro-particulier-command.response";
import { UserEmailAlreadyTakenException } from "@/core/application/features/auth/user-email-already-taken.exception";
import {
  UserPhoneNumberAlreadyTakenException,
} from "@/core/application/features/auth/user-phone-number-already-taken.exception";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IUsersDataRepository, IUsersRepository } from "@/core/domain/users";
import { IPasswordManagerService } from "@/core/domain/auth";
import { generateUuid } from "@/lib/ts-utilities/db";
import { UserRole } from "@/core/domain/roles";

@CommandHandler(RegisterProParticulierCommand)
export class RegisterProParticulierCommandHandler implements ICommandHandler<RegisterProParticulierCommand> {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
    @Inject(Deps.UsersDataRepository)
    private readonly usersDataRepository: IUsersDataRepository,
  ) {
  }

  async execute(command: RegisterProParticulierCommand): Promise<RegisterProParticulierCommandResponse> {
    await this.validateInput(command);

    const userId = generateUuid();
    const userData = await this.usersDataRepository.create({
      activite: command.activite,
      photoIdentite: command.photoIdentite,
      pieceIdentite: command.pieceIdentite,
      user: userId,
    });

    const user = await this.usersRepository.create({
      id: userId,
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: this.passwordManagerService.encryptPassword(command.password),
      firstName: command.firstName,
      lastName: command.lastName,
      role: UserRole.ProParticulier,
      city: command.city || null,
      additionalData: userData.id,
    });

    return new RegisterProParticulierCommandResponse({
      user,
    });
  }


  async validateInput(command: RegisterProParticulierCommand) {
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
