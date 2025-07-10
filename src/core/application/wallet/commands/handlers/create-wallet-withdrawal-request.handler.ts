import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateWalletWithdrawalRequestCommand } from "../create-wallet-withdrawal-request.command";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository, WalletWithDrawalRequest } from "@/core/domain/wallet";

@CommandHandler(CreateWalletWithdrawalRequestCommand)
export class CreateWalletWithdrawalRequestHandler implements ICommandHandler<CreateWalletWithdrawalRequestCommand> {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ) {}
    
    async execute(command: CreateWalletWithdrawalRequestCommand): Promise<WalletWithDrawalRequest> {
        return this.walletRepository.createWalletWithdrawalRequest(command);
    }
}