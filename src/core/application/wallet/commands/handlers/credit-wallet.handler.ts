import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreditWalletCommand } from "../credit-wallet.command";
import { IWalletRepository, Wallet } from "@/core/domain/wallet";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";

@CommandHandler(CreditWalletCommand)
export class CreditWalletHandler implements ICommandHandler<CreditWalletCommand> { 
    constructor(@Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository) {}
    async execute(command: CreditWalletCommand): Promise<Wallet> {
        return this.walletRepository.creditWallet(command.ownerId, command.amount, command.currency, command.source, command.sourceId, command.operator, command.note, command.releaseDate);
    }
}