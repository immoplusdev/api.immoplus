import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository, WalletWithDrawalRequest } from "@/core/domain/wallet";
import { UpdateWalletWithdrawalRequestCommand } from "../update-wallet-withdrawal-request.command";

@CommandHandler(UpdateWalletWithdrawalRequestCommand)
export class UpdateWalletWithdrawalRequestHandler implements ICommandHandler<UpdateWalletWithdrawalRequestCommand> {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ) {}
    
    async execute(command: UpdateWalletWithdrawalRequestCommand): Promise<WalletWithDrawalRequest> {
        const withdrawalRequest = await this.walletRepository.updateWalletWithdrawalRequest(command.id, command);
        return withdrawalRequest;
    }
}