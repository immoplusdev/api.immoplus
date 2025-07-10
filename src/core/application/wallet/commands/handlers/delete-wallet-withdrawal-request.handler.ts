import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository } from "@/core/domain/wallet";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteWalletWithdrawalRequestCommand } from "../delete-wallet-withdrawal-request.command";

@CommandHandler(DeleteWalletWithdrawalRequestCommand)
export class DeleteWalletWithdrawalRequestHandler implements ICommandHandler<DeleteWalletWithdrawalRequestCommand> {
    constructor(@Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository) {}
    
    execute(command: DeleteWalletWithdrawalRequestCommand): Promise<void> {
        return this.walletRepository.deleteWalletWithdrawalRequest(command.id);
    }
}