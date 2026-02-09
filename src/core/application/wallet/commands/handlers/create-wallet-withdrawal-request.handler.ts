import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateWalletWithdrawalRequestCommand } from "../create-wallet-withdrawal-request.command";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import {
  IWalletRepository,
  WalletWithDrawalRequest,
} from "@/core/domain/wallet";
import {
  IEmailTemplateService,
  EmailTemplate,
  IMailService,
} from "@/core/domain/notifications";
import { IUserRepository } from "@/core/domain/users";

@CommandHandler(CreateWalletWithdrawalRequestCommand)
export class CreateWalletWithdrawalRequestHandler implements ICommandHandler<CreateWalletWithdrawalRequestCommand> {
  constructor(
    @Inject(Deps.WalletRepository)
    private readonly walletRepository: IWalletRepository,
    @Inject(Deps.EmailTemplateService)
    private readonly emailTemplateService: IEmailTemplateService,
    @Inject(Deps.MailService)
    private readonly mailService: IMailService,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
  ) {}

  async execute(
    command: CreateWalletWithdrawalRequestCommand,
  ): Promise<WalletWithDrawalRequest> {
    const withdrawalRequest =
      await this.walletRepository.createWalletWithdrawalRequest(command);

    // Notify admins about the new withdrawal request
    this.notifyAdmins(withdrawalRequest, command);

    return withdrawalRequest;
  }

  private async notifyAdmins(
    withdrawalRequest: WalletWithDrawalRequest,
    command: CreateWalletWithdrawalRequestCommand,
  ): Promise<void> {
    try {
      const adminUsers = await this.usersRepository.findAdminUsers();
      const proprietaire =
        await this.usersRepository.findPublicUserInfoByUserId(command.owner);

      // Format montant
      const montantFormate = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
      }).format(command.amount || 0);

      // Format date
      const dateFormatee = new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const proprietaireName =
        `${proprietaire?.firstName || ""} ${proprietaire?.lastName || ""}`.trim() ||
        "Propriétaire";

      for (const admin of adminUsers) {
        const html = await this.emailTemplateService.render(
          EmailTemplate.NOUVELLE_DEMANDE_RETRAIT_ADMIN,
          {
            admin_name:
              `${admin.firstName || ""} ${admin.lastName || ""}`.trim() ||
              "Admin",
            nom_proprietaire: proprietaireName,
            montant: montantFormate,
            phone_number: command.phoneNumber,
            operator: command.operator || "Non spécifié",
            date: dateFormatee,
            lien: `https://admin.immoplus.ci`,
            unsubscribe_link: "https://immoplus.ci/unsubscribe",
          },
        );

        await this.mailService.sendMail({
          to: admin.email,
          subject: "Nouvelle demande de retrait à traiter",
          html,
        });
      }
    } catch (error) {
      console.error("Error notifying admins about withdrawal request:", error);
      // Don't throw error to prevent blocking the withdrawal request creation
    }
  }
}
