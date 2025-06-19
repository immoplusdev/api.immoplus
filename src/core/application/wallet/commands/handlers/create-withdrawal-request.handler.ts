import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateWithdrawalRequestCommand } from "../create-withdrawal-request.command";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IWalletRepository, WithDrawalRequest } from "@/core/domain/wallet";

@CommandHandler(CreateWithdrawalRequestCommand)
export class createWithdrawalRequestHandler implements ICommandHandler<CreateWithdrawalRequestCommand> {
    constructor(
        @Inject(Deps.WalletRepository) private readonly walletRepository: IWalletRepository
    ) {}
    
    async execute(command: CreateWithdrawalRequestCommand): Promise<WithDrawalRequest> {
        const withdrawalRequest = await this.walletRepository.createWithdrawalRequest(command);
        return withdrawalRequest;
    }
}