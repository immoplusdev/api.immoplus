import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteWalletTransactionCommand } from "../delete-wallet-transaction.command";
import { Inject } from "@nestjs/common";
import { IWalletRepository } from "@/core/domain/wallet";
import { Deps } from "@/core/domain/common/ioc";

@CommandHandler(DeleteWalletTransactionCommand)
export class DeleteWalletTransactionHandler implements ICommandHandler<DeleteWalletTransactionCommand> {
    constructor(@Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository) {}

    async execute(command: DeleteWalletTransactionCommand): Promise<void> {
        await this.walletRepository.deleteWalletTransaction(command.id);
    }
}