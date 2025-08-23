import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterProParticulierCommand } from "./register-pro-particulier.command";
import { RegisterProParticulierCommandResponse } from "./register-pro-particulier-command.response";
import { UserEmailAlreadyTakenException } from "@/core/application/auth/user-email-already-taken.exception";
import { UserPhoneNumberAlreadyTakenException } from "@/core/application/auth/user-phone-number-already-taken.exception";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IUserDataRepository, IUserRepository } from "@/core/domain/users";
import { IPasswordManagerService } from "@/core/domain/auth";
import { generateUuid } from "@/lib/ts-utilities/db";
import { UserRole } from "@/core/domain/roles";
import { IConfigsManagerService } from "@/core/domain/configs";

@CommandHandler(RegisterProParticulierCommand)
export class RegisterProParticulierCommandHandler
  implements ICommandHandler<RegisterProParticulierCommand>
{
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
    @Inject(Deps.UsersDataRepository)
    private readonly usersDataRepository: IUserDataRepository,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {}

  async execute(
    command: RegisterProParticulierCommand,
  ): Promise<RegisterProParticulierCommandResponse> {
    await this.validateInput(command);

    const userId = generateUuid();

    const userData = await this.usersDataRepository.createOne({
      activite: command.activite,
      photoIdentite: command.photoIdentiteId,
      pieceIdentite: command.pieceIdentiteId,
      user: userId,
    });

    const user = await this.usersRepository.createOne({
      id: userId,
      avatar: command.avatar || null,
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: this.passwordManagerService.encryptPassword(command.password),
      firstName: command.firstName,
      lastName: command.lastName,
      role: UserRole.ProParticulier,
      additionalData: userData.id as never,
      createdBy: this.configsManagerService.getEnvVariable(
        "NEST_APP_ADMIN_PASSWORD_ID",
      ),
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
    const user = await this.usersRepository.findOneByEmail(email);
    if (user?.id) throw new UserEmailAlreadyTakenException();
  }

  async verifyPhoneNumberAvailable(phoneNumber: string) {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber);
    if (user?.id) throw new UserPhoneNumberAlreadyTakenException();
  }
}
