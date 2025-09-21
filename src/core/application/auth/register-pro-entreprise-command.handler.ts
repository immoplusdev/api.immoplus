import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterProEntrepriseCommand } from "./register-pro-entreprise.command";
import { RegisterProEntrepriseCommandResponse } from "./register-pro-entreprise-command.response";
import { UserEmailAlreadyTakenException } from "@/core/application/auth/user-email-already-taken.exception";
import { UserPhoneNumberAlreadyTakenException } from "@/core/application/auth/user-phone-number-already-taken.exception";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IUserDataRepository, IUserRepository } from "@/core/domain/users";
import { IPasswordManagerService } from "@/core/domain/auth";
import { generateUuid } from "@/lib/ts-utilities/db";
import { UserRole } from "@/core/domain/roles";
import { IConfigsManagerService } from "@/core/domain/configs";
import { sanitizePhoneNumber } from "@/lib/ts-utilities/strings";

@CommandHandler(RegisterProEntrepriseCommand)
export class RegisterProEntrepriseCommandHandler
  implements ICommandHandler<RegisterProEntrepriseCommand>
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
    command: RegisterProEntrepriseCommand,
  ): Promise<RegisterProEntrepriseCommandResponse> {
    await this.validateInput(command);

    // Vérifier s'il existe un utilisateur supprimé avec cet email ou téléphone
    const deletedUser = await this.findDeletedUser(
      command.email,
      command.phoneNumber,
    );

    if (deletedUser) {
      // Restaurer et mettre à jour l'utilisateur existant
      const restoredUser = await this.restoreAndUpdateUser(
        deletedUser,
        command,
      );
      return new RegisterProEntrepriseCommandResponse({
        user: restoredUser,
      });
    }

    // Créer un nouvel utilisateur si aucun utilisateur supprimé n'existe
    const userId = generateUuid();
    const userData = await this.usersDataRepository.createOne({
      nomEntreprise: command.nomEntreprise,
      emailEntreprise: command.emailEntreprise,
      registreCommerce: command.registreCommerceId,
      numeroContribuable: command.numeroContribuable,
      typeEntreprise: command.typeEntreprise,
      user: userId,
    });

    const user = await this.usersRepository.createOne({
      id: userId,
      avatar: command.avatar || null,
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: this.passwordManagerService.encryptPassword(command.password),
      role: UserRole.ProEntreprise,
      additionalData: userData.id,
      createdBy: this.configsManagerService.getEnvVariable(
        "NEST_APP_ADMIN_PASSWORD_ID",
      ),
    });

    return new RegisterProEntrepriseCommandResponse({
      user,
    });
  }

  async validateInput(command: RegisterProEntrepriseCommand) {
    await this.verifyEmailAvailable(command.email);
    await this.verifyPhoneNumberAvailable(command.phoneNumber);
  }

  async findDeletedUser(email: string, phoneNumber: string) {
    // Chercher par email d'abord
    const userByEmail = await this.usersRepository.findOneByEmail(
      email.toLowerCase(),
      {
        withDeleted: true,
      },
    );

    if (userByEmail && userByEmail.deletedAt) {
      return userByEmail;
    }

    // Chercher par téléphone si pas trouvé par email
    const userByPhone = await this.usersRepository.findOneByPhoneNumber(
      sanitizePhoneNumber(phoneNumber),
      {
        withDeleted: true,
      },
    );

    if (userByPhone && userByPhone.deletedAt) {
      return userByPhone;
    }

    return null;
  }

  async restoreAndUpdateUser(
    deletedUser: any,
    command: RegisterProEntrepriseCommand,
  ) {
    // Mettre à jour les données additionnelles de l'utilisateur si elles existent
    if (deletedUser.additionalData) {
      await this.usersDataRepository.updateOne(deletedUser.additionalData, {
        nomEntreprise: command.nomEntreprise,
        emailEntreprise: command.emailEntreprise,
        registreCommerce: command.registreCommerceId,
        numeroContribuable: command.numeroContribuable,
        typeEntreprise: command.typeEntreprise,
      });
    } else {
      // Créer de nouvelles données additionnelles si elles n'existent pas
      const userData = await this.usersDataRepository.createOne({
        nomEntreprise: command.nomEntreprise,
        emailEntreprise: command.emailEntreprise,
        registreCommerce: command.registreCommerceId,
        numeroContribuable: command.numeroContribuable,
        typeEntreprise: command.typeEntreprise,
        user: deletedUser.id,
      });

      // Mettre à jour l'utilisateur avec les nouvelles données additionnelles
      await this.usersRepository.updateOne(deletedUser.id, {
        additionalData: userData.id,
      });
    }

    // Restaurer l'utilisateur en supprimant le deletedAt et en mettant à jour ses informations
    await this.usersRepository.updateOne(deletedUser.id, {
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: this.passwordManagerService.encryptPassword(command.password),
      avatar: command.avatar || null,
      role: UserRole.ProEntreprise,
      deletedAt: null, // Restaurer l'utilisateur
      updatedAt: new Date(),
    });

    // Récupérer l'utilisateur mis à jour
    return await this.usersRepository.findOne(deletedUser.id);
  }

  async verifyEmailAvailable(email: string) {
    const user = await this.usersRepository.findOneByEmail(email, {
      withDeleted: false,
    });
    if (user?.id) throw new UserEmailAlreadyTakenException();
  }

  async verifyPhoneNumberAvailable(phoneNumber: string) {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber, {
      withDeleted: false,
    });
    if (user?.id) throw new UserPhoneNumberAlreadyTakenException();
  }
}
