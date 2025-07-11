import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DebitWalletCommand } from "../debit-wallet.command";
import { IWalletRepository, Wallet } from "@/core/domain/wallet";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";

@CommandHandler(DebitWalletCommand)
export class DebitWalletHandler implements ICommandHandler<DebitWalletCommand> {
    constructor(@Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository) {}

    async execute(command: DebitWalletCommand): Promise<Wallet> {
        return this.walletRepository.debitWallet(command.ownerId, command.amount, command.currency, command.source, command.sourceId, command.operator);
    }
}