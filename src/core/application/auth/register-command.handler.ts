import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCommand } from "@/core/application/auth/register.command";
import { RegisterCommandResponse } from "@/core/application/auth/register-command.response";
import { Inject, BadRequestException } from "@nestjs/common";
import { IUserDataRepository, IUserRepository } from "@/core/domain/users";
import { UserEmailAlreadyTakenException } from "@/core/application/auth/user-email-already-taken.exception";
import { UserPhoneNumberAlreadyTakenException } from "@/core/application/auth/user-phone-number-already-taken.exception";
import { Deps } from "@/core/domain/common/ioc";
import {
  IPasswordManagerService,
  UnauthorizedException,
} from "@/core/domain/auth";
import { UserRole } from "@/core/domain/roles";
import { generateUuid } from "@/lib/ts-utilities/db";
import { IConfigsManagerService } from "@/core/domain/configs";
import { sanitizePhoneNumber } from "@/lib/ts-utilities/strings";
import { UserOtpRepository } from "@/infrastructure/features/users/user-otp.repository";
import {
  INotificationService,
  PushNotificationType,
} from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";
import { isFreePassEmail } from "@/infrastructure/features/auth/helpers";

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<
  RegisterCommand,
  RegisterCommandResponse
> {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.PasswordManagerService)
    private readonly passwordManagerService: IPasswordManagerService,
    @Inject(Deps.UsersDataRepository)
    private readonly usersDataRepository: IUserDataRepository,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
    private readonly userOtpRepository: UserOtpRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterCommandResponse> {
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

      // Send welcome notification
      await this.sendWelcomeNotification(restoredUser.id);

      return new RegisterCommandResponse({
        user: restoredUser,
      });
    }

    // Créer un nouvel utilisateur si aucun utilisateur supprimé n'existe
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
      createdBy: null,
      avatar: command.avatar || null,
    });

    // Send welcome notification
    await this.sendWelcomeNotification(user.id);

    return new RegisterCommandResponse({
      user,
    });
  }

  private async sendWelcomeNotification(userId: string): Promise<void> {
    try {
      const subject = this.globalizationService.t(
        "all.notifications.auth.welcome.subject",
      );
      const message = this.globalizationService.t(
        "all.notifications.auth.welcome.message",
      );

      await this.notificationService.sendNotification({
        userId,
        subject,
        message,
        skipInAppNotification: false,
        sendMail: true,
        sendSms: false,
        data: {
          type: PushNotificationType.Auth,
          id: null,
        },
      });
    } catch (error) {
      console.error("Error sending welcome notification:", error);
      // Don't throw error to prevent blocking user registration
    }
  }

  async validateInput(command: RegisterCommand) {
    await this.verifyEmailAvailable(command.email);
    await this.verifyPhoneNumberAvailable(command.phoneNumber);
    if (!isFreePassEmail(command.email))
      await this.verifyOtpToken(command.token, command.email);
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

  async restoreAndUpdateUser(deletedUser: any, command: RegisterCommand) {
    // Restaurer l'utilisateur en supprimant le deletedAt et en mettant à jour ses informations
    await this.usersRepository.updateOne(deletedUser.id, {
      email: command.email.toLowerCase(),
      phoneNumber: command.phoneNumber,
      password: this.passwordManagerService.encryptPassword(command.password),
      firstName: command.firstName,
      lastName: command.lastName,
      avatar: command.avatar || null,
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

  async verifyOtpToken(token: string, email: string) {
    try {
      const userOtp = await this.userOtpRepository.findOneByToken(token);

      if (!userOtp) {
        throw new BadRequestException("Token OTP invalide");
      }

      if (userOtp.email.toLowerCase() !== email.toLowerCase()) {
        throw new BadRequestException(
          "Le token OTP ne correspond pas à l'email fourni",
        );
      }

      if (!userOtp.isUsed) {
        throw new BadRequestException("Le code OTP n'a pas été vérifié");
      }

      if (new Date() > userOtp.otpExpiration) {
        throw new BadRequestException("Le token OTP a expiré");
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: error.message,
        statusCode: error.statusCode,
        error: error.error,
        code: error.code,
      });
    }
  }
}
